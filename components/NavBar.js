export default function NavBar() {
  return (
    <nav>
      <div className="container nav__container">
        <div className="profile">
          <div className="profile-photo">
            <img src="/images/perfil.webp" alt="Foto de perfil" />
          </div>
          <div className="info">
            <p>Hey, <b>User</b></p>
            <small>Admin</small>
          </div>
        </div>

        <div className="logo">
          <h2>LEICAM <span className="gray">MODAS</span></h2>
        </div>

        <div className="theme-toggler">
          <span className="material-icons-sharp active">light_mode</span>
          <span className="material-icons-sharp">dark_mode</span>
        </div>
      </div>
    </nav>
  );
}
