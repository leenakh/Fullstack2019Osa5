import React from 'react'


const LoginForm = ({ handleLogin, username, password }) => {
  return (
    <div className="login-frame">
      <form onSubmit={handleLogin}>
        <table>
          <tbody>
            <tr>
              <td className="login-cell">Käyttäjätunnus</td><td><input className="login-input" {... username} reset={null}/></td>
            </tr>
            <tr>
              <td className="login-cell">Salasana</td><td><input className="login-input" {... password} reset={null}/></td>
            </tr>
            <tr>
              <td><button type="submit">Kirjaudu sisään</button></td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  )
}

export default LoginForm