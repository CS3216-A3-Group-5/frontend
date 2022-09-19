import Module from "module"

interface ModuleState {
  listOfModules: Array<Module>
}

const initialState: ModuleState = {
  listOfModules: []
  
}