/**
 * API call handlers for modules.
 */

import { sampleModuleData } from './sampleData';
import { UniModule } from './types';

/**
 * Returns the full Module object given module code.
 */
export function getModule(moduleCode: string): UniModule {
  //TODO: make actual api call, now is just sample data
  for (const module of sampleModuleData) {
    if (module.code === moduleCode) {
      return module;
    }
  }
  throw Error('GET module: Module with given module code does not exist.');
}
