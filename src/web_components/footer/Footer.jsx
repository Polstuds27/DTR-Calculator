
import './footer.css';

function Footer(){
    return(

        <>

        <link rel="stylesheet" href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"/>
        <div className='footer-container'>
            <span>
                    Developed by: Polstuds27 
                    <br />
                    <a href="https://www.facebook.com/pauladrianne.mojal">
                        <span>
                            <i class='bx bxl-facebook-circle'></i>
                        </span>
                    </a>
                    <a href="https://www.instagram.com/poladrianne/">
                        <span>  
                            <i class='bx bxl-instagram'></i>
                        </span>
                    </a>
                    <a href="https://github.com/Polstuds27">
                        <span>
                            <i class='bx bxl-github'></i>
                        </span>
                    </a>
                </span>
        </div>
        </>
    );

}

export default Footer;