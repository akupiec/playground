void controlLogicInit() {
  setTemp = 0;
  setHyst = 0;
  readTempConfig(&setTemp, &setHyst);
  DBG_OUTPUT_PORT.printf("Temperature settings: %f | %f \n", setTemp, setHyst);
}

void controlLoogicLoop() {
  float currentTemp = getCurrentTemerature();
  if (setTemp + setHyst >= currentTemp) {
    DBG_OUTPUT_PORT.println("DISABLE POWER!");
  }
  if (setTemp + setHyst <= currentTemp) {
    DBG_OUTPUT_PORT.println("ENABLE POWER!");
  }
}

