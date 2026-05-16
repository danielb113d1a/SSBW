import { NavLink, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-base-200 font-montserrat">
      <nav className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><NavLink to="/" className={({ isActive }) => isActive ? 'active font-bold' : ''}>Portada</NavLink></li>
              <li><NavLink to="/tarea9" className={({ isActive }) => isActive ? 'active font-bold' : ''}>Tarea 9</NavLink></li>
              <li><NavLink to="/carousel" className={({ isActive }) => isActive ? 'active font-bold' : ''}>Carrusel de imágenes</NavLink></li>
            </ul>
          </div>
          <NavLink to="/" className="btn btn-ghost text-xl font-bold">Tarea 10</NavLink>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><NavLink to="/" className={({ isActive }) => isActive ? 'active font-bold' : ''}>Portada</NavLink></li>
            <li><NavLink to="/tarea9" className={({ isActive }) => isActive ? 'active font-bold' : ''}>Tarea 9</NavLink></li>
            <li><NavLink to="/carousel" className={({ isActive }) => isActive ? 'active font-bold' : ''}>Carrusel de imágenes</NavLink></li>
          </ul>
        </div>
        <div className="navbar-end">
          {/* Opcional: botón extra */}
        </div>
      </nav>

      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
