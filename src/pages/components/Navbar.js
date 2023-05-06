import Image from "next/image";
import Link from "next/link";
const Navbar = () => {
  return (
    <nav>
      <span>
        <Link href="https://www.orgpedia.in" className="logo">
          <Image src="/orgpediaIcon.ico" alt="icon" height={50} width={50} />
        </Link>
        <h1 className="orgpedia"><strong>Org</strong>pedia</h1>
        </span>
      <div>
        <h3 className="title">User Form Labelling</h3>
      </div>
    </nav>
  );
};

export default Navbar;
