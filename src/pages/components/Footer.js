const Footer = () => {
    const date = new Date();
    const year = date.getFullYear();
    return ( <footer><p>Copyright ©  {year} Orgpedia.in </p></footer> );
}
 
export default Footer;