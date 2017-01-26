#include <DNSServer.h>
const byte DNS_PORT = 53;
DNSServer dnsServer;

IPAddress apIP(192, 168, 8, 8);

void initWifi() { 
//  readAccessData(ssid, pass);
//  delay(100);
//  WiFi.mode(WIFI_AP_STA);
  WiFi.begin(ssid, pass);

  short attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 40) {
    delay(500);
    DBG_OUTPUT_PORT.print(".");
    attempts++;
  }
  DBG_OUTPUT_PORT.println("");

  if (WiFi.status() == WL_CONNECTED) {
    DBG_OUTPUT_PORT.print("Connected! IP address: ");
    DBG_OUTPUT_PORT.println(WiFi.localIP());
  }
  
  DBG_OUTPUT_PORT.print("Configuring access point...");
  WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));
  WiFi.softAP("ESP_WIFI-AP"); /* WiFi.softAP(ssid, password);*/

//  dnsServer.setErrorReplyCode(DNSReplyCode::NoError);
  dnsServer.start(DNS_PORT, "*", apIP);

  IPAddress myIP = WiFi.softAPIP();
  DBG_OUTPUT_PORT.print("AP IP address: ");
  DBG_OUTPUT_PORT.println(myIP);
}

IPAddress getMyAPIP() {
  return WiFi.softAPIP();
}

IPAddress getMyIP() {
  return WiFi.localIP();
}

bool isWiFiConnected()  {
  return WiFi.status() == WL_CONNECTED;
}

void wifiLoop() {
  dnsServer.processNextRequest();
}

