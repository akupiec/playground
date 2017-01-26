void controlLogicInit() {
  pinMode(SWITCHER_BUS, OUTPUT);
  setTemp = 0;
  setHyst = 0;
  refreshTempsConfig();
}

void refreshTempsConfig() {
  readTempConfig(&setTemp, &setHyst);
  DBG_OUTPUT_PORT.println("Temperature settings: " + String(setTemp) + " | " + String(setHyst));
}

void controlLoogicLoop() {
  float currentTemp = getCurrentTemerature();
  if (setTemp + setHyst >= currentTemp) {
    digitalWrite(SWITCHER_BUS, HIGH);
  }
  if (setTemp - setHyst <= currentTemp) {
    digitalWrite(SWITCHER_BUS, LOW);
  }
}

