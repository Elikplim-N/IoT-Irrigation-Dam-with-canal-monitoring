#include <OneWire.h>
#include <DallasTemperature.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// Pin definitions
const int tp = 14; // turbidity pin
const int tank = 12; // water sensor in the reservoir pin
const int canal = 2; // water sensor in the canal pin
const int tempPin = 25; // ds18b20 pin
const int redLED = 26; // red LED pin
const int greenLED = 27; // green LED pin
const int buzzer = 13; // buzzer pin

// Threshold definitions
const int turbidityThreshold = 3000; // Example threshold for turbidity in NTU
const float tankLevelHighThreshold = 95.0;
const float tankLevelLowThreshold = 60.0;
const float canalLevelHighThreshold = 80.0;
const float canalLevelLowThreshold = 60.0;

// Initialize the OneWire bus and DallasTemperature library
OneWire oneWire(tempPin);
DallasTemperature sensors(&oneWire);

const char* ssid = "where are you?";
const char* password = "12121212";
const char* serverUrl = "https://api.waziup.io/api/v2/devices/IoT_Dam/sensors/";

int mapToNTU(int sensorValue) {
  // Map the analog reading (0-1023) to NTU (10-5000)
  int ntu = map(sensorValue, 0, 1023, 10, 5000);
  return ntu/10000;
}

void setup() {
  // Initialize the digital pins as inputs
  pinMode(tank, INPUT);
  pinMode(canal, INPUT);
  pinMode(tp, INPUT);
  
  // Initialize the digital pins as outputs
  pinMode(redLED, OUTPUT);
  pinMode(greenLED, OUTPUT);
  pinMode(buzzer, OUTPUT);
  
  // Start the serial communication
  Serial.begin(115200);

  // Start the DS18B20 sensor
  sensors.begin();
}

void connectToWiFi() {
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi");

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("WiFi connected successfully");
  } else {
    Serial.println("Failed to connect to WiFi");
  }
}

void sendDataToSensor(String sensorId, float value) {
  if (WiFi.status() == WL_CONNECTED) {
    // Create JSON object
    StaticJsonDocument<200> jsonDocument;
    jsonDocument["value"] = value;
    
    // Serialize JSON to a string
    String jsonString;
    serializeJson(jsonDocument, jsonString);
    Serial.println(jsonString);
    
    // Construct the complete URL with sensor ID
    String url = String(serverUrl) + sensorId + "/value";
    
    // Send HTTP POST request
    HTTPClient http;
    http.begin(url);
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.POST(jsonString);
    
    // Check for successful HTTP POST
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      String response = http.getString();
      Serial.println(response);
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    
    // End HTTP connection
    http.end();
  }
}

void enterDeepSleep() {
  // Configure the wake-up source as the timer
  esp_sleep_enable_timer_wakeup(60 * 1000000); // 1 SEC
  esp_deep_sleep_start();
}

void loop() {
  // Read the analog value from the water level sensor in the tank
  float tLevel = analogRead(tank);

  // Read the analog value from the water level sensor in the canal
  float cLevel = analogRead(canal);

  // Request temperature readings from the DS18B20 sensor
  sensors.requestTemperatures();
  float temperatureC = sensors.getTempCByIndex(0);

  // Read the analog value from the turbidity sensor
  int turbidityReading = analogRead(tp);
  // Convert the turbidity reading to NTU
  int tbdNTU = mapToNTU(turbidityReading);

  // Calculate the percentage levels
  float tLevelPercent = (tLevel / 2200.0) * 100.0;
  float cLevelPercent = (cLevel / 2200.0) * 100.0;

  // Print the water level in the tank
  Serial.print("Tank Level: ");
  Serial.print(tLevelPercent);
  Serial.println("%");
  Serial.println(".........................................");

  // Print the water level in the canal
  Serial.print("Canal Level: ");
  Serial.print(cLevelPercent);
  Serial.println("%");
  Serial.println(".........................................");
  
  // Print the water turbidity in NTU
  Serial.print("Water Turbidity: ");
  Serial.print(tbdNTU);
  Serial.println(" NTU");
  Serial.println(".........................................");

  // Print the temperature reading
  Serial.print("Temperature: ");
  Serial.print(temperatureC);
  Serial.println(" °C");
  Serial.println(".........................................");
  Serial.println(".........................................");

  // Check the thresholds
  bool alert = false;
  if (tbdNTU > turbidityThreshold) {
    alert = true;
    Serial.println("Turbidity threshold exceeded!");
  }
  if (tLevelPercent > tankLevelHighThreshold || tLevelPercent < tankLevelLowThreshold) {
    alert = true;
    Serial.println("Tank level threshold exceeded!");
  }
  if (cLevelPercent > canalLevelHighThreshold || cLevelPercent < canalLevelLowThreshold) {
    alert = true;
    Serial.println("Canal level threshold exceeded!");
  } 

  // Activate LEDs and buzzer based on alert status
  if (alert) {
    digitalWrite(redLED, HIGH);
    digitalWrite(greenLED, LOW);
    tone(buzzer, 1500);
  } else {
    digitalWrite(redLED, LOW);
    digitalWrite(greenLED, HIGH);
    noTone(buzzer);
  }

  // Connect to WiFi, send data, and disconnect
  connectToWiFi();
  sendDataToSensor("TC", temperatureC);
  sendDataToSensor("TB", tbdNTU);
  sendDataToSensor("TL", tLevelPercent);
  sendDataToSensor("CL", cLevelPercent);
  WiFi.disconnect(true);
  WiFi.mode(WIFI_OFF);

  // Enter deep sleep mode
  enterDeepSleep();
}
