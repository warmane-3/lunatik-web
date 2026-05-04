import Home from './views/Home/Home'
import './App.css'
import { Route, Routes, useLocation } from 'react-router'
import NavBar from './components/Navbar/NavBar'
import Login from './components/Login/Login'
import ForgotPassword from './views/Login/ForgotPassword'
import { useState } from 'react'
import Register from './components/Register/Register'
import ItemBis from './views/ItemsBis/ItemsBis'
import Rules from './views/Rules/Rules'
import LootTable from './views/LootTable/LootTable'
import LootRules from './views/LootRules/LootRules'
import Footer from './components/Footer/Footer'

const App = () => {
  const [showAddDKP, setShowAddDkp] = useState(false)
  const { pathname } = useLocation()
  console.log(pathname)
  return (
    <div className='App flex flex-col min-h-screen'>
      {pathname !== '/register' && pathname !== '/login' && pathname !== '/login/forgot-password' && <NavBar />}
      <main className='flex-1'>
        <Routes>
          <Route path='/' element={<Home showAddDKP={showAddDKP} />} />
          <Route
            path='/login'
            element={<Login setShowAddDkp={setShowAddDkp} />}
          />
          <Route
            path='/login/forgot-password'
            element={<ForgotPassword />}
          />
          <Route
            path='/register'
            element={<Register setShowAddDkp={setShowAddDkp} />}
          />
          <Route
            path='/itembis/*'
            element={<ItemBis setShowAddDkp={setShowAddDkp} />}
          />
          <Route path='/rules' element={<Rules />} />
          <Route path='/loottable' element={<LootTable />} />
          <Route path='/lootrules' element={<LootRules />} />
        </Routes>
      </main>
      {pathname !== '/login' && pathname !== '/register' && pathname !== '/login/forgot-password' && <Footer />}
    </div>
  )
}

export default App
