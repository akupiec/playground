void handleRoot() {
  if (!handleFileRead("/login.htm")) server.send(404, "text/plain", "FileNotFound");
}

void wifiEndpoints() {
  server.on("/saveWifi", HTTP_GET, []() {
    DBG_OUTPUT_PORT.println("ServerArgs: " + server.args());
    saveAccessData(server.arg("login"), server.arg("password"));
    server.send(200, "text/plain", "Config changed ESP - Restart required! Open http://" + String(host) + ".local/edit to see the file browser");
  });

  server.on("/generate_204", handleRoot);  //Android captive portal. Maybe not needed. Might be handled by notFound handler.
  server.on("/fwlink", handleRoot);  //Microsoft captive portal. Maybe not needed. Might be handled by notFound handler.
}

void serverFileEndpoints() {
  server.on("/list", HTTP_GET, handleFileList);
  server.on("/edit", HTTP_GET, []() {
    if (!handleFileRead("/edit.htm")) server.send(404, "text/plain", "FileNotFound");
  });
  server.on("/edit", HTTP_PUT, handleFileCreate);
  server.on("/edit", HTTP_DELETE, handleFileDelete);
  server.on("/edit", HTTP_POST, []() {
    server.send(200, "text/plain", "");
  }, handleFileUpload);
}

void apiEndpoints() {  
  server.on("/all", HTTP_GET, []() {
    String json = "{";
    json += "\"heap\":" + String(ESP.getFreeHeap());
    json += ", \"analog\":" + String(analogRead(A0));
    json += ", \"gpio\":" + String((uint32_t)(((GPI | GPO) & 0xFFFF) | ((GP16I & 0x01) << 16)));
    json += "}";
    server.send(200, "text/json", json);
    json = String();
  });

  server.on("/saveTemp", HTTP_POST, [](){
     saveTempConfig(server.arg("temp").toFloat(), server.arg("hyst").toFloat());
     server.send(200, "text/plain", "Config changed");
  });
}

void serverInit() {
  wifiEndpoints();
  serverFileEndpoints();
  apiEndpoints();
  server.onNotFound([]() {
    if (!handleFileRead(server.uri()))
      server.send(404, "text/plain", "FileNotFound");
  });

  server.begin();
  DBG_OUTPUT_PORT.println("HTTP server started");
}

void serverLoop() {
  server.handleClient();
}

