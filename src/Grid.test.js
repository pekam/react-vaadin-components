import React from 'react';
import * as grid from './Grid';
import Enzyme, {mount, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({adapter: new Adapter()});

const getElement = (props) => {
  return mount(<grid.GridColumn {...props} />).instance()._element;
}

test('should render the body cell content', () => {
  const column = getElement({renderer: () => <div>foo</div>});
  const root = document.createElement('div');
  column.renderer(root);
  expect(root.textContent).toBe('foo');
});

test('should render the header cell content', () => {
  const column = getElement({headerComponent: <div>foo</div>});
  const root = document.createElement('div');
  column.headerRenderer(root);
  expect(root.textContent).toBe('foo');
});

test('should render the details cell content', () => {
  const Grid = mount(<grid.Grid rowDetailsRenderer={() => <div>foo</div>} />).instance()._element;
  const root = document.createElement('div');
  Grid.rowDetailsRenderer(root);
  expect(root.textContent).toBe('foo');
});

test('should not have a details renderer', () => {
  const Grid = mount(<grid.Grid />).instance()._element;
  expect(Grid.rowDetailsRenderer).toBe(undefined);
});

test('should have the expected tag name', () => {
  for (let componentName in grid) {
    const GridComponent = grid[componentName];
    const tagName = 'vaadin-' + componentName.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`).substr(1);
    const component = shallow(<GridComponent />);
    expect(component.instance().tagName).toBe(tagName);
  }
});

test('renderer should inherit context', () => {
  const AppContext = React.createContext();
  const Consumer = AppContext.Consumer;

  const column = mount(<AppContext.Provider value={{foo: 'bar'}}>
      <grid.GridColumn renderer={() => <Consumer>{
        ({foo}) => <div>{foo}</div>
      }</Consumer>} />
  </AppContext.Provider>).instance()._element;

  const root = document.createElement('div');
  column.renderer(root);
  column.renderer(root);

  expect(root.textContent).toBe('bar');
});

test('details renderer should inherit context', () => {
  const AppContext = React.createContext();
  const Consumer = AppContext.Consumer;

  const _grid = mount(<AppContext.Provider value={{foo: 'bar'}}>
      <grid.Grid rowDetailsRenderer={() => <Consumer>{
        ({foo}) => <div>{foo}</div>
      }</Consumer>} />
  </AppContext.Provider>).instance()._element;

  const root = document.createElement('div');
  _grid.rowDetailsRenderer(root, _grid);
  _grid.rowDetailsRenderer(root, _grid);

  expect(root.textContent).toBe('bar');
});

test('headerComponent should inherit context', () => {
  const AppContext = React.createContext();
  const Consumer = AppContext.Consumer;

  const column = mount(<AppContext.Provider value={{foo: 'bar'}}>
      <grid.GridColumn headerComponent={<Consumer>{
        ({foo}) => <div>{foo}</div>
      }</Consumer>} />
  </AppContext.Provider>).instance()._element;

  const root = document.createElement('div');
  column.headerRenderer(root);
  column.headerRenderer(root);

  expect(root.textContent).toBe('bar');
});



