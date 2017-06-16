#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>

#define SWITCHER_BUS 15
#define ONE_WIRE_BUS 14

#define STR_LENGTH 32
const char* host = "thermo";
char ssid[STR_LENGTH] = "kupiecLan";
char pass[STR_LENGTH] = "uwo45trx22091988";

ESP8266WebServer server(80);
#define DBG_OUTPUT_PORT Serial

#include <OneWire.h>
#include <DallasTemperature.h>



OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
DeviceAddress insideThermometer;

float setTemp = 0;
float setHyst = 0;

void setup(void) {
  DBG_OUTPUT_PORT.begin(115200);
  DBG_OUTPUT_PORT.print("\n");
  DBG_OUTPUT_PORT.setDebugOutput(true);
  DBG_OUTPUT_PORT.println("Setup Start");
  
  initFileData();
  initWifi();
  serverInit();
  tempInit();
  controlLogicInit();
  
  DBG_OUTPUT_PORT.println("Ready to go!");
}

void loop(void) {
  wifiLoop();
  serverLoop();
  controlLoogicLoop();
  tempLoop();
}
