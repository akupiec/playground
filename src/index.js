import {app} from './app';
import {StageManager} from './StageManager';

const manager = new StageManager(app);
const startStage = manager.generateStartStage();
manager.setStage(startStage);