#include <DNSServer.h>
const byte DNS_PORT = 53;
DNSServer dnsServer;

IPAddress apIP(192, 168, 1, 1);




void initWifi() {
  //WIFI INIT
//  char ssid[STR_LENGTH] = "doopa";
//  char pass[STR_LENGTH] = "doopa";

  const char* ssid = "kupiecLan";
  const char* password = "uwo45trx22091988";
  WiFi.begin(ssid, password);
// Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  if (MDNS.begin("esp8266")) {
    Serial.println("MDNS responder started");
  }


  
//  readAccessData(ssid, pass);
//  WiFi.mode(WIFI_AP_STA);
//  DBG_OUTPUT_PORT.printf("Connecting to _%s_ | _%s_\n", ssid, pass);
//  delay(100);
//  
//  WiFi.begin(ssid, pass);
//
//  short attempts = 0;
//  while (WiFi.status() != WL_CONNECTED && attempts < 40) {
//    delay(500);
//    DBG_OUTPUT_PORT.print(".");
//    attempts++;
//  }
//  DBG_OUTPUT_PORT.println("");
//
//  if (WiFi.status() == WL_CONNECTED) {
//    DBG_OUTPUT_PORT.print("Connected! IP address: ");
//    DBG_OUTPUT_PORT.println(WiFi.localIP());
//  } 
//  
//    DBG_OUTPUT_PORT.println("IP address:" +  WiFi.localIP());
//  
//  DBG_OUTPUT_PORT.print("Configuring access point...");
//  WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));
//  WiFi.softAP("ESP_WIFI-AP"); /* WiFi.softAP(ssid, password);*/
//
//  dnsServer.setErrorReplyCode(DNSReplyCode::NoError);
//  dnsServer.start(DNS_PORT, "*", apIP);
//
//  IPAddress myIP = WiFi.softAPIP();
//  DBG_OUTPUT_PORT.print("AP IP address: ");
//  DBG_OUTPUT_PORT.println(myIP);
//
//  MDNS.begin(host);
//  DBG_OUTPUT_PORT.print("Open http://");
//  DBG_OUTPUT_PORT.print(host);
//  DBG_OUTPUT_PORT.println(".local/edit to see the file browser");
}

bool isWiFiConnected()  {
  return WiFi.status() == WL_CONNECTED;
}

void wifiLoop() {
  dnsServer.processNextRequest();
}

