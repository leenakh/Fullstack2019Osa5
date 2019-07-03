import App from './App'
import React from 'react'
import 'jest-dom/extend-expect'
import { render, waitForElement, cleanup } from '@testing-library/react'
jest.mock('./services/blogs')

afterEach(cleanup)


describe('<App />', () => {

  test('does not render blogs if no user logged in', async () => {
    const component = render(
      <App />
    )
    component.debug()
    component.rerender(<App />)
    /*await waitForElement(
      () => component.getByText('Foo')
    )*/
    const login = component.container.querySelector('login-frame')
    expect(login).toBeDefined()
  })
})


