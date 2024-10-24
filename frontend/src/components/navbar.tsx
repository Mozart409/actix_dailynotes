export function Navbar() {
  return (
    <nav className="container">
      <ul>
        <li>
          <a href="/">
            <strong>Dailynotes</strong>
          </a>
        </li>
      </ul>
      <ul>
        <li>
          <a href="#" className="contrast">
            About
          </a>
        </li>
        <li>
          <a href="#" className="contrast">
            Services
          </a>
        </li>
        <li>
          <a href="#" className="contrast">
            Products
          </a>
        </li>
      </ul>
    </nav>
  );
}
