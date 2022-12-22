import NavigationBar from './conponents/NavigationBar'
import SearchBar from './conponents/SearchBar'
import { useRoutes, useLocation } from 'react-router-dom'
import routes from './routes/routes';
import './App.scss';
function App() {
  const element = useRoutes(routes);
  const { pathname } = useLocation()
  let state = (pathname !== '/index' && pathname !== '/') ? 'active' : '';
  return (
    <div id='App' className={'w ' + state}>
      <NavigationBar class={state} />
      <SearchBar class={state} />
      <div className={'mainContainer ' + state} >
        {element}
      </div>
    </div>

  );
}

export default App;
