import Home from './views/Home/Home'
import './App.css'
import { Route, Routes, useLocation } from 'react-router'
import NavBar from './components/Navbar/NavBar'
import Login from './components/Login/Login'
import ForgotPassword from './views/Login/ForgotPassword'
import Admin from './views/Admin/Admin'
import NotFound from './views/NotFound/NotFound'
import { useState } from 'react'
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
      {pathname !== '/login/forgot-password' && <NavBar />}
      <main className='flex-1'>
        <Routes>
          <Route path='/' element={<Home showAddDKP={showAddDKP} />} />
          <Route
            path='/login'
            element={<Login setShowAddDkp={setShowAddDkp} />}
          />
          <Route path='/login/forgot-password' element={<ForgotPassword />} />
          <Route
            path='/itembis/*'
            element={<ItemBis setShowAddDkp={setShowAddDkp} />}
          />
          <Route path='/rules' element={<Rules />} />
          <Route path='/loottable' element={<LootTable />} />
          <Route path='/lootrules' element={<LootRules />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
      {pathname !== '/login' &&
        pathname !== '/register' &&
        pathname !== '/login/forgot-password' && <Footer />}
    </div>
  )
}

export default App
