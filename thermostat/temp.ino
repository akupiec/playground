void printAddress(DeviceAddress deviceAddress) {
  for (uint8_t i = 0; i < 8; i++)  {
    if (deviceAddress[i] < 16) DBG_OUTPUT_PORT.print("0");
    DBG_OUTPUT_PORT.print(deviceAddress[i], HEX);
  }
}

//float currentTemperature;
void printTemperature(DeviceAddress deviceAddress) {
  DBG_OUTPUT_PORT.print("Temp C: ");
  DBG_OUTPUT_PORT.print(sensors.getTempC(deviceAddress));
  DBG_OUTPUT_PORT.println("");
}

float getCurrentTemerature() {
  return sensors.getTempC(insideThermometer);
}

void tempInit(void) {
  DBG_OUTPUT_PORT.println("Dallas Temperature IC Control Library Demo");

  DBG_OUTPUT_PORT.println("Dallas Temperature IC Control Library Demo");

  // locate devices on the bus
  DBG_OUTPUT_PORT.print("Locating devices...");
  sensors.begin();
  DBG_OUTPUT_PORT.print("Found ");
  DBG_OUTPUT_PORT.print(sensors.getDeviceCount(), DEC);
  DBG_OUTPUT_PORT.println(" devices.");

  // report parasite power requirements
  DBG_OUTPUT_PORT.print("Parasite power is: "); 
  if (sensors.isParasitePowerMode()) DBG_OUTPUT_PORT.println("ON");
  else DBG_OUTPUT_PORT.println("OFF");
  
  // Assign address manually. The addresses below will beed to be changed
  // to valid device addresses on your bus. Device address can be retrieved
  // by using either oneWire.search(deviceAddress) or individually via
  // sensors.getAddress(deviceAddress, index)
  // Note that you will need to use your specific address here
  //insideThermometer = { 0x28, 0x1D, 0x39, 0x31, 0x2, 0x0, 0x0, 0xF0 };

  // Method 1:
  // Search for devices on the bus and assign based on an index. Ideally,
  // you would do this to initially discover addresses on the bus and then 
  // use those addresses and manually assign them (see above) once you know 
  // the devices on your bus (and assuming they don't change).
  if (!sensors.getAddress(insideThermometer, 0)) DBG_OUTPUT_PORT.println("Unable to find address for Device 0"); 
  
  // method 2: search()
  // search() looks for the next device. Returns 1 if a new address has been
  // returned. A zero might mean that the bus is shorted, there are no devices, 
  // or you have already retrieved all of them. It might be a good idea to 
  // check the CRC to make sure you didn't get garbage. The order is 
  // deterministic. You will always get the same devices in the same order
  //
  // Must be called before search()
  //oneWire.reset_search();
  // assigns the first address found to insideThermometer
  //if (!oneWire.search(insideThermometer)) DBG_OUTPUT_PORT.println("Unable to find address for insideThermometer");

  // show the addresses we found on the bus
  DBG_OUTPUT_PORT.print("Device 0 Address: ");
  printAddress(insideThermometer);
  DBG_OUTPUT_PORT.println();

  // set the resolution to 9 bit (Each Dallas/Maxim device is capable of several different resolutions)
  sensors.setResolution(insideThermometer, 10);
 
  DBG_OUTPUT_PORT.print("Device 0 Resolution: ");
  DBG_OUTPUT_PORT.print(sensors.getResolution(insideThermometer), DEC); 
  DBG_OUTPUT_PORT.println();
}

void tempLoop(void) {
//  DBG_OUTPUT_PORT.print("Requesting temperatures...");
  sensors.requestTemperatures(); // Send the command to get temperatures
//  DBG_OUTPUT_PORT.println("DONE");
  
  // It responds almost immediately. Let's print out the data
 //printTemperature(insideThermometer); // Use a simple function to print out the data
}


