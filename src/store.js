import { legacy_createStore as createStore } from 'redux';  
import rootReducer from './reducers'; // 假设你有一个根reducer文件  
  
const store = createStore(rootReducer);  
  
export default store;