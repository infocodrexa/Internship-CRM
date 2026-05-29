// ================= server/index.js =================
require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const puppeteer = require("puppeteer");
const cors = require("cors");
const archiver = require("archiver");
const PDFDocument = require("pdfkit");
const app = express();
let db = [];
// 🔥 MEMORY STORAGE (Excel Data)
let excelData = [];
app.use(cors());
app.use(express.json());

// ===== HTML TEMPLATE (YOUR DESIGN CAN BE PASTED HERE) =====
function generateHTML(student) {
  return `



<html lang="English">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Internship Offer Letter - CodRexa</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background-color: #d8d8d8;
            font-family: 'Source Sans 3', 'Segoe UI', sans-serif;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding: 30px 20px;
            min-height: 100vh;
        }

        /* A4: 210mm × 297mm = 794px × 1123px at 96dpi */
        .letter-container {
width: 210mm;
    height: 297mm;            
            background: #fff;
            position: relative;
            box-shadow: 0 4px 30px rgba(0,0,0,0.25);
            border: 2.5px solid #c8900a;
            display: flex;
            flex-direction: column;
        }

        /* Inner decorative border */
        .outer-border {
            position: absolute;
            top: 8px; left: 8px; right: 8px; bottom: 8px;
            border: 1px solid #002e5b;
            pointer-events: none;
            z-index: 0;
        }

        /* Corner ornaments */
        .corner {
            position: absolute;
            width: 28px;
            height: 28px;
            z-index: 2;
        }
        .corner-tl { top: 4px; left: 4px; border-top: 3px solid #c8900a; border-left: 3px solid #c8900a; }
        .corner-tr { top: 4px; right: 4px; border-top: 3px solid #c8900a; border-right: 3px solid #c8900a; }
        .corner-bl { bottom: 4px; left: 4px; border-bottom: 3px solid #c8900a; border-left: 3px solid #c8900a; }
        .corner-br { bottom: 4px; right: 4px; border-bottom: 3px solid #c8900a; border-right: 3px solid #c8900a; }

        .inner-content {
            padding: 36px 44px 0 44px;
            flex: 1;
            position: relative;
            z-index: 1;
        }

        /* ===== HEADER ===== */
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 2px;
        }

        .left-logo {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logo-main {
            width: 72px;
            height: 72px;
            object-fit: contain;
        }

        /* Fallback logo placeholder (shown when image is missing) */
        .logo-main-placeholder {
            width: 72px;
            height: 72px;
            background: #002e5b;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            color: #4fc3f7;
            font-weight: 700;
            letter-spacing: 1px;
            flex-shrink: 0;
        }

        .company-name h1 {
            margin: 0;
            font-size: 30px;
            font-family: 'Playfair Display', serif;
            color: #002e5b;
            line-height: 1.1;
        }

        .company-name p {
            margin: 2px 0 0 0;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 2px;
            color: #333;
        }

        .company-name span {
            font-size: 11px;
            color: #555;
            font-style: italic;
        }

        .right-logo {
            text-align: right;
        }

        .logo-national {
            width: 140px;
            height: auto;
            object-fit: contain;
            display: block;
            margin-left: auto;
        }

        /* Fallback for national logo */
        .logo-national-placeholder {
            width: 140px;
            height: 80px;
            border: 2px solid #138808;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 8px 12px;
        }

        .national-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #ff9933 33%, #fff 33%, #fff 66%, #138808 66%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            font-weight: 900;
            color: #138808;
            border: 2px solid #138808;
            border-radius: 4px;
            flex-shrink: 0;
        }

        .national-text-block {
            text-align: left;
        }

        .national-text-block .gov-line {
            font-size: 8px;
            color: #555;
            display: flex;
            align-items: center;
            gap: 4px;
            margin-bottom: 2px;
        }

        .national-text-block .portal-title {
            font-size: 14px;
            font-weight: 900;
            color: #002e5b;
            text-transform: uppercase;
            letter-spacing: 1px;
            line-height: 1.1;
        }

        .national-text-block .portal-subtitle {
            font-size: 18px;
            font-weight: 900;
            color: #138808;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .aicte-id {
            font-size: 9.5px;
            color: #444;
            margin-top: 2px;
            font-style: italic;
        }

        /* ===== DIVIDER ===== */
        .divider {
            display: flex;
            align-items: center;
            gap: 0;
            margin: 14px 0;
        }

        .divider::before,
        .divider::after {
            content: '';
            flex: 1;
            height: 2px;
            background: linear-gradient(to right, #e0a500, #c8900a);
        }

        .divider::after {
            background: linear-gradient(to left, #e0a500, #c8900a);
        }

        .diamond {
            width: 10px;
            height: 10px;
            background: #e0a500;
            display: inline-block;
            transform: rotate(45deg);
            margin: 0 10px;
            flex-shrink: 0;
        }

        .bottom-divider {
            margin: 10px 0 16px 0;
        }

        /* ===== TITLE ===== */
        .main-title {
            text-align: center;
            color: #002e5b;
            font-size: 27px;
            font-family: 'Playfair Display', serif;
            letter-spacing: 3px;
            font-weight: 700;
        }

        /* ===== META INFO ===== */
        .meta-info {
            text-align: right;
            font-size: 13.5px;
            line-height: 1.7;
            color: #222;
            margin-bottom: 0px;
        }

        /* ===== LETTER BODY ===== */
        .letter-body {
            font-size: 13.5px;
            line-height: 1.75;
            color: #1a1a1a;
        }

        .letter-body p {
            margin-bottom: 5px;
        }

        .letter-body h3 {
            color: #002e5b;
            font-size: 14px;
            margin: 14px 0 6px 0;
        }

        .letter-body ul {
            margin: 4px 0 10px 20px;
            list-style: disc;
        }

        .letter-body ul li {
            margin-bottom: 4px;
        }

        .letter-body ol {
            margin: 4px 0 10px 20px;
        }

        .letter-body ol li {
            margin-bottom: 4px;
        }

        /* ===== BADGES + SIGNATURE ROW ===== */
        .badges-sign-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 20px;
            border-top: 1px solid #ccc;
            padding-top: 14px;
            padding-bottom: 14px;
            gap: 10px;
        }

        .badges {
            display: flex;
            align-items: center;
            gap: 80px;
            flex: 1;
        }

        .badges img {
            height: 58px;
            width: auto;
            object-fit: contain;
        }

        /* ===== SIGNATURE ===== */
        .footer-sign {
            flex-shrink: 0;
            text-align: left;
        }

        .signature {
            text-align: left;
            font-size: 13.5px;
            line-height: 1.6;
        }

        .signature p {
            margin: 0;
        }

        .sign-img {
            width: 110px;
            height: 44px;
            object-fit: contain;
            display: block;
            margin: 4px 0 2px 0;
        }

        /* Fallback signature placeholder */
        .sign-placeholder {
            width: 140px;
            height: 44px;
            font-family: 'Playfair Display', cursive;
            font-size: 26px;
            color: #002e5b;
            display: flex;
            align-items: center;
            margin: 4px 0 2px 0;
        }

        /* Badge placeholders */
        .badge-placeholder {
            height: 62px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 1.5px solid #aaa;
            border-radius: 50%;
            padding: 6px 12px;
            font-size: 9px;
            font-weight: 700;
            color: #555;
            text-align: center;
            min-width: 62px;
        }

        .badge-aicte { border-color: #b8860b; color: #b8860b; }
        .badge-iso { border-color: #555; color: #333; }
        .badge-msme { border-color: #003580; color: #003580; }

        .badge-startup {
            font-family: 'Source Sans 3', sans-serif;
            font-size: 14px;
            font-weight: 900;
            color: #138808;
            letter-spacing: -0.5px;
            border: none;
            min-width: auto;
        }

        .badge-startup .hash { color: #ff6600; }

        /* ===== CONTACT BAR ===== */
        .contact-bar {
            background: #002e5b;
            color: white;
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 10px 20px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.3px;
        }

        .contact-bar span {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .contact-bar span .icon {
            width: 18px;
            height: 18px;
            background: rgba(255,255,255,0.15);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
        }

        /* ===== PRINT / A4 ===== */
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .letter-container {
                box-shadow: none;
                width: 210mm;
                min-height: 297mm;
            }
        }
    </style>
</head>
<body>

<div class="letter-container">
    <div class="outer-border"></div>
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>

    <div class="inner-content">

        <header>
            <div class="left-logo">
                <!-- Main Logo - replace src with your actual image path -->
                <img src="https://res.cloudinary.com/dyclnfuka/image/upload/q_auto/f_auto/v1777024866/logo-main_yvp7ck.png" class="logo-main"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                     alt="CodRexa Logo">
                <div class="logo-main-placeholder" style="display:none;">
                    CodRexa
                </div>

                <div class="company-name">
                    <h1>CodRexa</h1>
                    <p>PRIVATE LIMITED</p>
                    <span>(Internship &amp; Training Division)</span>
                </div>
            </div>

            <div class="right-logo">
                <!-- National Internship Portal Logo - replace src with your actual image path -->
                <img src="https://res.cloudinary.com/dyclnfuka/image/upload/v1777024866/logo-national_ysxrlv.jpg" class="logo-national"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                     alt="National Internship Portal">

                <!-- Fallback placeholder for national logo -->
                <div class="logo-national-placeholder" style="display:none;">
                    <div class="national-icon">N</div>
                    <div class="national-text-block">
                        <div class="gov-line">
                            <span>🏛️</span>
                            <span>विकास संस्थान MINISTRY OF EDUCATION</span>
                        </div>
                        <div class="portal-title">NATIONAL<br>INTERNSHIP</div>
                        <div class="portal-subtitle">PORTAL</div>
                    </div>
                </div>

            </div>
        </header>

        <div class="divider"><span class="diamond"></span></div>

        <h2 class="main-title">INTERNSHIP OFFER LETTER</h2>

        <div class="divider bottom-divider"><span class="diamond"></span></div>

        <div class="meta-info">
           <p><b>Date:</b> ${student.Date}</p>
          <p><b>Intern ID:</b> ${student.InternID}</p>
        </div>

        <section class="letter-body">

            <p>Dear <b>${student.Name}</b>,</p>


            <p>
                We are pleased to offer you a <strong>${student.FinalDuration}</strong> Internship as a
                <b>${student.Designation}</b> at
                <strong>CodRexa</strong>, a platform dedicated to empowering learners
                and providing real-world industry exposure.
            </p>

            <h3>Internship Details:</h3>

            <ul>
                <li><strong>Designation:</strong>&nbsp; ${student.Designation}</li>
                <li><strong>Location:</strong>&nbsp; Remote / India</li>
                <li><strong>Duration:</strong>&nbsp; ${student.FinalDuration}</li>
                <li><strong>Reporting To:</strong>&nbsp; Gautam Kumar</li>
            </ul>

            <p>
                This internship program is designed to provide practical exposure, enhance your technical
                skills, and help you gain real-world experience in web development.
            </p>

            <p>As an intern, you are expected to:</p>

            <ol>
                <li>Complete all assigned tasks and projects on time.</li>
                <li>Follow instructions given by your mentors/supervisors.</li>
                <li>Actively participate in meetings and discussions.</li>
                <li>Provide regular updates on your progress.</li>
                <li>Maintain professionalism and discipline.</li>
                <li>Collaborate effectively with team members.</li>
                <li>Accept feedback and improve accordingly.</li>
            </ol>

            <p>
                This program will be an enriching experience for you, helping you build strong technical
                and professional skills. We look forward to working with you and supporting your career growth.
            </p>

            <p>
                If you accept this offer, kindly proceed with your assigned tasks and training modules.
            </p>

        </section>

        <div class="badges-sign-row">
            <!-- LEFT: Badges -->
            <div class="badges">
                <img src="https://res.cloudinary.com/dyclnfuka/image/upload/v1777024867/badge-aicte_govcyf.webp" alt="AICTE"
                     onerror="this.style.display='none'; this.insertAdjacentHTML('afterend', '<div class=\'badge-placeholder badge-aicte\'>AICTE<br>Certified</div>')">

                <img src="https://res.cloudinary.com/dyclnfuka/image/upload/v1777024865/badge-iso_l430ti.webp" alt="ISO"
                     onerror="this.style.display='none'; this.insertAdjacentHTML('afterend', '<div class=\'badge-placeholder badge-iso\'>CERTIFIED<br>ISO<br>9001:2015</div>')">

                <img src="https://res.cloudinary.com/dyclnfuka/image/upload/v1777024865/badge-msme_bplvlr.png" alt="MSME"
                     onerror="this.style.display='none'; this.insertAdjacentHTML('afterend', '<div class=\'badge-placeholder badge-msme\'>🏛️<br>msme<br>Ministry of MSME<br>Govt. of India</div>')">

                <img src="https://res.cloudinary.com/dyclnfuka/image/upload/v1777024865/badge-startup_ueisrx.png" alt="Startup India" class="startup"
                     onerror="this.style.display='none'; this.insertAdjacentHTML('afterend', '<div class=\'badge-placeholder badge-startup\'><span class=\'hash\'>#</span>startupindia</div>')">
            </div>

            <!-- RIGHT: Signature -->
            <footer class="footer-sign">
                <div class="signature">
                    <p>Best regards,</p>
                    <img src="https://res.cloudinary.com/dyclnfuka/image/upload/v1777024866/signature_vutgb2.jpg" class="sign-img"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                         alt="Signature">
                    <div class="sign-placeholder" style="display:none;">Gautam Kumar</div>
                    <p><strong>Gautam Kumar</strong></p>
                    <p>HR &amp; Manager</p>
                    <p>CodRexa</p>
                </div>
            </footer>
        </div>

    </div><!-- end inner-content -->

    <div class="contact-bar">
        <span><span class="icon">✉</span> codrexa.hr@gmail.com</span>
        <span><span class="icon">🌐</span> www.codrexa.in</span>
        <span><span class="icon">📞</span> 7300423846</span>
    </div>

</div>

</body>
</html>

`;
}

// ===== CERTIFICATE HTML TEMPLATE =====
// function generateCertificateHTML(student) {
//   const name = student.Name || "John Doe";
//   return `
//   <!doctype html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>CodRexa Internship Certificate</title>
//     <link
//       href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cinzel+Decorative:wght@700&family=Cinzel:wght@700;900&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap"
//       rel="stylesheet"
//     />
//     <style>
//       * {
//         margin: 0;
//         padding: 0;
//         box-sizing: border-box;
//       }

//       html, body {
//         margin: 0;
//         padding: 0;
//         width: 860px;
//         height: 650px;
//         overflow: hidden; 
//       }

//       .outer-border {
//         width: 860px;
//         height: 650px; 
//         box-sizing: border-box;
//         background: #1b2a5e;
//         padding: 6px;
//         position: relative;
//       }

//       .gold-border {
//         background: linear-gradient(
//           to bottom,
//           #c9a84c 0%,
//           #f7e198 25%,
//           #c9a84c 50%,
//           #f7e198 75%,
//           #c9a84c 100%
//         );
//         padding: 5px;
//         position: relative;
//         height: 100%;
//       }

//       .certificate {
//         background: #ffffff;
//         position: relative;
//         padding: 28px 36px 22px 36px;
//         overflow: visible;
//         height: 100%;
//       }

//       .cert-corner {
//         position: absolute;
//         width: 90px;
//         height: 90px;
//         z-index: 3;
//         overflow: hidden;
//       }
//       .cert-corner.tl { top: 0; left: 0; }
//       .cert-corner.tr { top: 0; right: 0; }
//       .cert-corner.bl { bottom: 0; left: 0; }
//       .cert-corner.br { bottom: 0; right: 0; }

//       .cert-corner::before {
//         content: "";
//         position: absolute;
//         width: 90px;
//         height: 90px;
//         background: #1b2a5e;
//       }
//       .cert-corner.tl::before { top: 0; left: 0; }
//       .cert-corner.tr::before { top: 0; right: 0; }
//       .cert-corner.bl::before { bottom: 0; left: 0; }
//       .cert-corner.br::before { bottom: 0; right: 0; }

//       .cert-corner::after {
//         content: "";
//         position: absolute;
//         width: 180px;
//         height: 180px;
//         background: white;
//         border-radius: 50%;
//         z-index: 2;
//       }
//       .cert-corner.tl::after { top: 0; left: 0; }
//       .cert-corner.tr::after { top: 0; right: 0; }
//       .cert-corner.bl::after { bottom: 0; left: 0; }
//       .cert-corner.br::after { bottom: 0; right: 0; }

//       .inner-navy-border {
//         border: 2.5px solid #1b2a5e;
//         border-radius: 40px;
//         padding: 20px 28px 18px 28px;
//         position: relative;
//         z-index: 10;
//         margin: 0px 0px;
//         height: 100%;
//         overflow: hidden; 
//       }

//       /* 🔥 DOT PATTERN BACKGROUNDS */
//       .dot-pattern {
//         position: absolute;
//         width: 320px;
//         height: 320px;
//         background-image: radial-gradient(circle, #b0b0b0 2.5px, transparent 3px);
//         background-size: 20px 20px; 
//         z-index: 0;
//         pointer-events: none; 
//       }

//       /* Top Right Fade */
//       .dots-top-right {
//         top: 0;
//         right: 0;
//         -webkit-mask-image: radial-gradient(circle at top right, black 20%, transparent 65%);
//         mask-image: radial-gradient(circle at top right, black 20%, transparent 65%);
//       }

//       /* Bottom Left Fade */
//       .dots-bottom-left {
//         bottom: 0;
//         left: 0;
//         -webkit-mask-image: radial-gradient(circle at bottom left, black 20%, transparent 65%);
//         mask-image: radial-gradient(circle at bottom left, black 20%, transparent 65%);
//       }

//       .cert-content-wrapper {
//         position: relative;
//         z-index: 5;
//         height: 100%;
//         display: flex;
//         flex-direction: column;
//         justify-content: space-between;
//       }

//       /* ══════════ HEADER ══════════ */
//       .header {
//         display: flex;
//         align-items: center;
//         justify-content: space-between;
//         padding-bottom: 14px;
//         border-bottom: 1.5px solid #cccccc;
//       }

//       .logo-left {
//         display: flex;
//         align-items: center;
//         gap: 12px;
//       }

//       .company-logo-img {
//         width: 58px;
//         height: 58px;
//         border-radius: 50%;
//         object-fit: cover;
//       }

//       .company-name {
//         font-size: 24px;
//         font-weight: 1000;
//         letter-spacing: 0.5px;
//       }

//       .badges {
//         display: flex;
//         align-items: center;
//         gap: 16px;
//       }

//       .badge-img {
//         width: 62px;
//         height: 62px;
//         object-fit: contain;
//       }

//       /* ══════════ TITLE ══════════ */
//       .title-row {
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         gap: 18px;
//         margin: 22px 0 4px;
//       }

//       .deco-line {
//         display: flex;
//         align-items: center;
//         gap: 0;
//       }
//       .deco-line .line-seg {
//         height: 2.5px;
//         background: #c9a84c;
//       }
//       .deco-line .circle-node {
//         width: 10px;
//         height: 10px;
//         border-radius: 50%;
//         border: 2.5px solid #c9a84c;
//         background: white;
//         flex-shrink: 0;
//       }

//       .cert-title {
//         font-family: "Cinzel", serif;
//         font-size: 36px;
//         font-weight: 900;
//         color: #1b2a5e;
//         letter-spacing: 3px;
//         text-transform: uppercase;
//         white-space: nowrap;
//       }

//       /* ══════════ BODY ══════════ */
//       .certify-line {
//         text-align: center;
//         font-family: "EB Garamond", serif;
//         font-style: italic;
//         font-size: 17px;
//         color: #333;
//         margin-top: 14px;
//         letter-spacing: 0.5px;
//       }

//       .full-name {
//         font-family: "Great Vibes", cursive;
//         font-size: 62px;
//         color: #1b2a5e;
//         text-align: center;
//         margin: 6px 0 0px;
//         line-height: 1.05;
//       }

//       .gold-underline {
//         height: 2px;
//         background: linear-gradient(
//           to right,
//           transparent 5%,
//           #c9a84c 20%,
//           #c9a84c 80%,
//           transparent 95%
//         );
//         margin: 2px auto 12px;
//         width: 65%;
//       }

//       .completed-line {
//         text-align: center;
//         font-family: "EB Garamond", serif;
//         font-style: italic;
//         font-size: 17px;
//         color: #333;
//         margin-bottom: 10px;
//       }

//       .domain-line {
//         text-align: center;
//         font-family: "EB Garamond", serif;
//         font-size: 22px;
//         font-weight: 600;
//         color: #1b2a5e;
//         margin-bottom: 14px;
//       }

//       .with-line {
//         text-align: center;
//         font-family: "EB Garamond", serif;
//         font-size: 17px;
//         color: #222;
//         margin-bottom: 6px;
//       }
//       .with-line .brand {
//         color: #1b2a5e;
//         font-weight: 700;
//       }
//       .with-line .highlight {
//         color: #c9a84c;
//         font-weight: 700;
//       }

//       .wish-line {
//         text-align: center;
//         font-family: "EB Garamond", serif;
//         font-size: 18px;
//         font-weight: 600;
//         color: #1b2a5e;
//         margin-bottom: 32px;
//       }

//       /* ══════════ FOOTER ══════════ */
//       .footer {
//         display: flex;
//         align-items: flex-end;
//         justify-content: space-between;
//         margin-top: auto; 
//       }

//       /* .cert-no-block {
//         text-align: center;
//         min-width: 180px;
//       } */

//       .cert-no-block {
//         text-align: center;
//         min-width: 180px;
//         /* 🔥 NAYI LINES START (Dots ko text ke peeche chhipane ke liye) */
//         background-color: rgba(255, 255, 255, 0.95); /* Halka white background */
//         padding: 5px 10px; /* Box ke andar thodi jagah */
//         border-radius: 6px; /* Halka sa gol kona */
//         box-shadow: 0 0 10px white; /* Aas-paas halka white glow */
//         /* 🔥 NAYI LINES END */
//       }
//       .cert-no-block .cert-id {
//         font-family: "EB Garamond", serif;
//         font-size: 14px;
//         color: #1b2a5e;
//         font-weight: 600;
//         border-bottom: 1.5px solid #1b2a5e;
//         padding-bottom: 3px;
//         display: inline-block;
//       }
//       .cert-no-block .cert-label {
//         font-family: "EB Garamond", serif;
//         font-size: 13px;
//         color: #444;
//         margin-top: 3px;
//         font-style: italic;
//       }

//       .startup-india {
//         text-align: center;
//       }
//       .startup-india .si-text {
//         font-size: 24px;
//         font-weight: 900;
//         font-family: Arial, sans-serif;
//         line-height: 1;
//       }
//       .si-hash { color: #f97316; }
//       .si-startup { color: #1b2a5e; }
//       .si-india { color: #22c55e; }
//       .si-arrow {
//         display: inline-block;
//         width: 0;
//         height: 0;
//         border-top: 10px solid #22c55e;
//         border-left: 10px solid transparent;
//         border-right: 0;
//         vertical-align: middle;
//         margin-left: 1px;
//         margin-bottom: 2px;
//       }

//       .signature-block {
//         text-align: center;
//         min-width: 160px;
//       }

//       .signature-block img {
//         width: 110px;
//         display: block;
//         margin: 0 auto 4px auto;
//       }

//       .signature-block .sig-title {
//         font-family: "EB Garamond", serif;
//         font-size: 13px;
//         color: #333;
//         margin-top: 2px;
//       }

//       .signature-block .sig-name {
//         font-family: "Great Vibes", cursive;
//         font-size: 22px;
//         color: #1b2a5e;
//         margin-top: 2px;
//       }

//       .issue-date {
//         text-align: center;
//         font-family: "EB Garamond", serif;
//         font-style: italic;
//         font-size: 13px;
//         color: #555;
//         margin-top: 14px;
//       }

//     .title-of {
//       color: #c9a84c; /* Ye 'Of' ko gold color dega */
//     }

//     @media print {
//     body {
//         -webkit-print-color-adjust: exact;
//         print-color-adjust: exact;
//     }
//     }

// /* @keyframes fadeUp {
//   from { opacity: 0; transform: translateY(20px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// .outer-border {
//   animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// } */

      
//     </style>
//   </head>
//   <body>
//     <div class="outer-border">
//       <div class="gold-border">
//         <div class="certificate">
//           <div class="cert-corner tl"></div>
//           <div class="cert-corner tr"></div>
//           <div class="cert-corner bl"></div>
//           <div class="cert-corner br"></div>

//           <div class="inner-navy-border">
            
//             <div class="dot-pattern dots-top-right"></div>
//             <div class="dot-pattern dots-bottom-left"></div>

//             <div class="cert-content-wrapper">
              
//               <div class="header">
//                 <div class="logo-left">
//                   <img
//                     src="https://res.cloudinary.com/dyclnfuka/image/upload/q_auto/f_auto/v1777024866/logo-main_yvp7ck.png"
//                     alt="Company Logo"
//                     class="company-logo-img"
//                   />
//                   <div class="company-name">CodRexa</div>
//                 </div>

//                 <div class="badges">
//                   <img
//                     src="https://res.cloudinary.com/dyclnfuka/image/upload/v1777024865/badge-msme_bplvlr.png"
//                     alt="MSME"
//                     class="badge-img"
//                   />
//                   <img
//                     src="https://res.cloudinary.com/dyclnfuka/image/upload/v1777024866/logo-national_ysxrlv.jpg"
//                     alt="National"
//                     class="badge-img"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <div class="title-row">
//                   <div class="deco-line">
//                     <div class="line-seg" style="width: 30px"></div>
//                     <div class="line-seg" style="width: 6px"></div>
//                     <div class="circle-node"></div>
//                     <div class="line-seg" style="width: 6px"></div>
//                     <div class="line-seg" style="width: 6px"></div>
//                   </div>

//                   <!-- <div class="cert-title">Certificate Of Internship </div> -->
//                   <div class="cert-title">Certificate <span class="title-of">Of</span> Internship</div>

//                   <div class="deco-line">
//                     <div class="line-seg" style="width: 6px"></div>
//                     <div class="line-seg" style="width: 6px"></div>
//                     <div class="circle-node"></div>
//                     <div class="line-seg" style="width: 6px"></div>
//                     <div class="line-seg" style="width: 30px"></div>
//                   </div>
//                 </div>

//                 <p class="certify-line">This is to certify that</p>
//                 <div class="full-name"> ${name}</div>
//                 <div class="gold-underline"></div>
//                 <p class="completed-line">has successfully completed ${student.FinalDuration} Internship as a</p>
//                 <div class="domain-line"> ${student.Domain}</div>
//                 <p class="with-line">
//                   With <span class="brand">CodRexa</span> from
//                   <span class="highlight">${student.StartDate}</span> to
//                   <span class="highlight">${student.EndDate}</span>
//                 </p>
//                 <p class="wish-line">We wish all the best for intern future endeavors and a successful career ahead.</p>
//               </div>

//               <div>
//                 <div class="footer">
//                   <div class="cert-no-block">
//                     <div class="cert-id">${student.CertificateID}</div>
//                     <div class="cert-label">Certificate No:</div>
//                   </div>

//                   <div class="startup-india">
//                     <div class="si-text">
//                       <span class="si-hash">#</span><span class="si-startup">startup</span><span class="si-india">india</span><span class="si-arrow"></span>
//                     </div>
//                   </div>

//                   <div class="signature-block">
//                     <img src="https://res.cloudinary.com/dyclnfuka/image/upload/v1777024866/signature_vutgb2.jpg" alt="Signature" />
//                     <div>Gautam Kumar</div>
//                     <div class="sig-title">HR & Manager</div>
//                   </div>
//                 </div>
//                 <div class="issue-date">Issue Date - ${student.Date}</div>
//               </div>

//             </div> </div>
//         </div>
//       </div>
//     </div>
//   </body>
// </html>
// `;
// }

function generateCertificateHTML(student) {
  const name = student.Name || "John Doe";

  // ✅ Dynamic Duration Logic
  const duration = student.Duration || student.duration || "";
  const durationText =
    student.DurationText ||
    student.durationText ||
    student.durationType ||
    "Weeks";

  const finalDuration =
    student.FinalDuration || `${duration} ${durationText}`.trim();

  return `
  <!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CodRexa Internship Certificate</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cinzel+Decorative:wght@700&family=Cinzel:wght@700;900&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap"
      rel="stylesheet"
    />
    <link href="https://fonts.googleapis.com/css2?family=Allura&family=Parisienne&family=Tangerine:wght@700&display=swap" rel="stylesheet">
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      html, body {
        margin: 0;
        padding: 0;
        width: 860px;
        height: 650px;
        overflow: hidden; 
      }

      .outer-border {
        width: 860px;
        height: 650px; 
        box-sizing: border-box;
        background: #1b2a5e;
        padding: 6px;
        position: relative;
      }

      .gold-border {
        background: linear-gradient(
          to bottom,
          #c9a84c 0%,
          #f7e198 25%,
          #c9a84c 50%,
          #f7e198 75%,
          #c9a84c 100%
        );
        padding: 5px;
        position: relative;
        height: 100%;
      }

      .certificate {
        background: #ffffff;
        position: relative;
        padding: 28px 36px 22px 36px;
        overflow: visible;
        height: 100%;
      }

      .cert-corner {
        position: absolute;
        width: 90px;
        height: 90px;
        z-index: 3;
        overflow: hidden;
      }

      .cert-corner.tl { top: 0; left: 0; }
      .cert-corner.tr { top: 0; right: 0; }
      .cert-corner.bl { bottom: 0; left: 0; }
      .cert-corner.br { bottom: 0; right: 0; }

      .cert-corner::before {
        content: "";
        position: absolute;
        width: 90px;
        height: 90px;
        background: #1b2a5e;
      }

      .cert-corner.tl::before { top: 0; left: 0; }
      .cert-corner.tr::before { top: 0; right: 0; }
      .cert-corner.bl::before { bottom: 0; left: 0; }
      .cert-corner.br::before { bottom: 0; right: 0; }

      .cert-corner::after {
        content: "";
        position: absolute;
        width: 180px;
        height: 180px;
        background: white;
        border-radius: 50%;
        z-index: 2;
      }

      .cert-corner.tl::after { top: 0; left: 0; }
      .cert-corner.tr::after { top: 0; right: 0; }
      .cert-corner.bl::after { bottom: 0; left: 0; }
      .cert-corner.br::after { bottom: 0; right: 0; }

      .inner-navy-border {
        border: 2.5px solid #1b2a5e;
        border-radius: 40px;
        padding: 20px 28px 18px 28px;
        position: relative;
        z-index: 10;
        margin: 0px 0px;
        height: 100%;
        overflow: hidden; 
      }

      .dot-pattern {
        position: absolute;
        width: 320px;
        height: 320px;
        background-image: radial-gradient(circle, #b0b0b0 2.5px, transparent 3px);
        background-size: 20px 20px; 
        z-index: 0;
        pointer-events: none; 
      }

      .dots-top-right {
        top: 0;
        right: 0;
        -webkit-mask-image: radial-gradient(circle at top right, black 20%, transparent 65%);
        mask-image: radial-gradient(circle at top right, black 20%, transparent 65%);
      }

      .dots-bottom-left {
        bottom: 0;
        left: 0;
        -webkit-mask-image: radial-gradient(circle at bottom left, black 20%, transparent 65%);
        mask-image: radial-gradient(circle at bottom left, black 20%, transparent 65%);
      }

      .cert-content-wrapper {
        position: relative;
        z-index: 5;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 14px;
        border-bottom: 1.5px solid #cccccc;
      }

      .logo-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .company-logo-img {
        width: 58px;
        height: 58px;
        border-radius: 50%;
        object-fit: cover;
      }

      .company-name {
        font-size: 24px;
        font-weight: 1000;
        letter-spacing: 0.5px;
      }

      .badges {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .badge-img {
        width: 62px;
        height: 62px;
        object-fit: contain;
      }

      .title-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 18px;
        margin: 22px 0 4px;
      }

      .deco-line {
        display: flex;
        align-items: center;
        gap: 0;
      }

      .deco-line .line-seg {
        height: 2.5px;
        background: #c9a84c;
      }

      .deco-line .circle-node {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 2.5px solid #c9a84c;
        background: white;
        flex-shrink: 0;
      }

      .cert-title {
        font-family: "Cinzel", serif;
        font-size: 36px;
        font-weight: 900;
        color: #1b2a5e;
        letter-spacing: 3px;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .certify-line {
        text-align: center;
        font-family: "EB Garamond", serif;
        font-style: italic;
        font-size: 17px;
        color: #333;
        margin-top: 14px;
        letter-spacing: 0.5px;
      }

      

.full-name {
  font-family: "Allura", cursive;
  font-size: 68px;
  color: #1b2a5e;
  text-align: center;
  margin: 6px 0 0px;
  line-height: 1.05;
}

      .gold-underline {
        height: 2px;
        background: linear-gradient(
          to right,
          transparent 5%,
          #c9a84c 20%,
          #c9a84c 80%,
          transparent 95%
        );
        margin: 2px auto 12px;
        width: 65%;
      }

      .completed-line {
        text-align: center;
        font-family: "EB Garamond", serif;
        font-style: italic;
        font-size: 17px;
        color: #333;
        margin-bottom: 10px;
      }

      .domain-line {
        text-align: center;
        font-family: "EB Garamond", serif;
        font-size: 22px;
        font-weight: 600;
        color: #1b2a5e;
        margin-bottom: 14px;
      }

      .with-line {
        text-align: center;
        font-family: "EB Garamond", serif;
        font-size: 17px;
        color: #222;
        margin-bottom: 6px;
      }

      .with-line .brand {
        color: #1b2a5e;
        font-weight: 700;
      }

      .with-line .highlight {
        color: #c9a84c;
        font-weight: 700;
      }

      .wish-line {
        text-align: center;
        font-family: "EB Garamond", serif;
        font-size: 18px;
        font-weight: 600;
        color: #1b2a5e;
        margin-bottom: 32px;
      }

      .footer {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        margin-top: auto; 
      }

      .cert-no-block {
        text-align: center;
        min-width: 180px;
        background-color: rgba(255, 255, 255, 0.95);
        padding: 5px 10px;
        border-radius: 6px;
        box-shadow: 0 0 10px white;
      }

      .cert-no-block .cert-id {
        font-family: "EB Garamond", serif;
        font-size: 14px;
        color: #1b2a5e;
        font-weight: 600;
        border-bottom: 1.5px solid #1b2a5e;
        padding-bottom: 3px;
        display: inline-block;
      }

      .cert-no-block .cert-label {
        font-family: "EB Garamond", serif;
        font-size: 13px;
        color: #444;
        margin-top: 3px;
        font-style: italic;
      }

      .startup-india {
        text-align: center;
      }

      .startup-india .si-text {
        font-size: 24px;
        font-weight: 900;
        font-family: Arial, sans-serif;
        line-height: 1;
      }

      .si-hash { color: #f97316; }
      .si-startup { color: #1b2a5e; }
      .si-india { color: #22c55e; }

      .si-arrow {
        display: inline-block;
        width: 0;
        height: 0;
        border-top: 10px solid #22c55e;
        border-left: 10px solid transparent;
        border-right: 0;
        vertical-align: middle;
        margin-left: 1px;
        margin-bottom: 2px;
      }

      .signature-block {
        text-align: center;
        min-width: 160px;
      }

      .signature-block img {
        width: 110px;
        display: block;
        margin: 0 auto 4px auto;
      }

      .signature-block .sig-title {
        font-family: "EB Garamond", serif;
        font-size: 13px;
        color: #333;
        margin-top: 2px;
      }

      .signature-block .sig-name {
        font-family: "Great Vibes", cursive;
        font-size: 22px;
        color: #1b2a5e;
        margin-top: 2px;
      }

      .issue-date {
        text-align: center;
        font-family: "EB Garamond", serif;
        font-style: italic;
        font-size: 13px;
        color: #555;
        margin-top: 14px;
      }

      .title-of {
        color: #c9a84c;
      }

      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    </style>
  </head>

  <body>
    <div class="outer-border">
      <div class="gold-border">
        <div class="certificate">
          <div class="cert-corner tl"></div>
          <div class="cert-corner tr"></div>
          <div class="cert-corner bl"></div>
          <div class="cert-corner br"></div>

          <div class="inner-navy-border">
            <div class="dot-pattern dots-top-right"></div>
            <div class="dot-pattern dots-bottom-left"></div>

            <div class="cert-content-wrapper">
              <div class="header">
                <div class="logo-left">
                  <img
                    src="https://res.cloudinary.com/dyclnfuka/image/upload/q_auto/f_auto/v1777024866/logo-main_yvp7ck.png"
                    alt="Company Logo"
                    class="company-logo-img"
                  />
                  <div class="company-name">CodRexa</div>
                </div>

                <div class="badges">
                  <img
                    src="https://res.cloudinary.com/dyclnfuka/image/upload/v1777024865/badge-msme_bplvlr.png"
                    alt="MSME"
                    class="badge-img"
                  />
                  <img
                    src="https://res.cloudinary.com/dyclnfuka/image/upload/v1777024866/logo-national_ysxrlv.jpg"
                    alt="National"
                    class="badge-img"
                  />
                </div>
              </div>

              <div>
                <div class="title-row">
                  <div class="deco-line">
                    <div class="line-seg" style="width: 30px"></div>
                    <div class="line-seg" style="width: 6px"></div>
                    <div class="circle-node"></div>
                    <div class="line-seg" style="width: 6px"></div>
                    <div class="line-seg" style="width: 6px"></div>
                  </div>

                  <div class="cert-title">
                    Certificate <span class="title-of">Of</span> Internship
                  </div>

                  <div class="deco-line">
                    <div class="line-seg" style="width: 6px"></div>
                    <div class="line-seg" style="width: 6px"></div>
                    <div class="circle-node"></div>
                    <div class="line-seg" style="width: 6px"></div>
                    <div class="line-seg" style="width: 30px"></div>
                  </div>
                </div>

                <p class="certify-line">This is to certify that</p>

                <div class="full-name">${name}</div>

                <div class="gold-underline"></div>

                <p class="completed-line">
                  has successfully completed ${finalDuration} Internship as a
                </p>

                <div class="domain-line">${student.Domain || ""}</div>

                <p class="with-line">
                  With <span class="brand">CodRexa</span> from
                  <span class="highlight">${student.StartDate || ""}</span> to
                  <span class="highlight">${student.EndDate || ""}</span>
                </p>

                <p class="wish-line">
                  We wish all the best for intern future endeavors and a successful career ahead.
                </p>
              </div>

              <div>
                <div class="footer">
                  <div class="cert-no-block">
                    <div class="cert-id">${student.CertificateID || ""}</div>
                    <div class="cert-label">Certificate No:</div>
                  </div>

                  <div class="startup-india">
                    <div class="si-text">
                      <span class="si-hash">#</span><span class="si-startup">startup</span><span class="si-india">india</span><span class="si-arrow"></span>
                    </div>
                  </div>

                  <div class="signature-block">
                    <img
                      src="https://res.cloudinary.com/dyclnfuka/image/upload/v1777024866/signature_vutgb2.jpg"
                      alt="Signature"
                    />
                    <div>Gautam Kumar</div>
                    <div class="sig-title">HR & Manager</div>
                  </div>
                </div>

                <div class="issue-date">Issue Date - ${student.EndDate || ""}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`;
}
// ===== EMAIL FUNCTION =====
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ===== HTML TO PDF FUNCTION (PDFKit) - NOT IN USE CURRENTLY =====
function generatePDFBuffer(student) {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
    const name = student.Name || student.name || "Unknown";
    const domain = student.Domain || student.domain || "Unknown";
    doc.fontSize(18).text("Certificate", { align: "center" });
    doc.moveDown();
    doc.text(`Name: ${name}`);
    doc.text(`Domain: ${domain}`);
    doc.end();
  });
}

// ===== SEND OFFERS ENDPOINT =====
// app.post("/send-offers", async (req, res) => {
//   const students = req.body.data;

//   const browser = await puppeteer.launch({ headless: "new" });

//   try {
//     for (let student of students) {
//       try {
//         const html = generateHTML(student);

//         const page = await browser.newPage();

//         // 🔥 IMPORTANT (full load)
//         await page.setContent(html, { waitUntil: "networkidle0" });

//         // 📄 PDF Generate
//         const pdf = await page.pdf({
//           format: "A4",
//           printBackground: true,
//           margin: {
//             top: "0px",
//             bottom: "0px",
//             left: "0px",
//             right: "0px",
//           },
//         });

//         // 📩 Email Send
//         await transporter.sendMail({
//           from: `HR TEAM - CodRexa <${process.env.EMAIL_USER}>`,
//           to: student.Email,
//           subject: "Internship Offer Letter",
//           html: `
// <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">

// <p>Dear <b>${student.Name}</b>,</p>

// <p>Congratulations 🎉</p>

// <p>
//   We are excited to offer you the position of <b>${student.Designation}</b> at 
//   <b>CodRexa</b>.
// </p>

// <p><b>Intern ID:</b> ${student.InternID}</p>
// <p><b>Duration:</b> ${student.Duration} Weeks</p>
// <p><b>Date:</b> ${student.Date}</p>
// <hr>

// <h3>🚀 About CodRexa</h3>
// <p>
// CodRexa is a fast-growing organization focused on empowering students 
// with real-world skills. We believe that learning should go beyond theory, and that's why 
// our internship programs are designed to provide practical exposure, live projects, and 
// industry-level experience.
// </p>

// <p>
// Thousands of students across India are already part of CodRexa, building their careers 
// with us. Now, it's your turn to grow, learn, and achieve something big 🚀
// </p>

// <hr>

// <h3>🔗 Important Links</h3>

// <p>
// 👉 <b>Start Your Training:</b><br>
// <a href="${"https://drive.google.com/drive/folders/1QXe3hH5jf6OYh6wT0qad3MjmDdHfdVLZ?usp=sharing"}">${"Access Your Course"}</a>
// </p>

// <p>
// 👉 <b>Submit Your Tasks:</b><br>
// <a href="${"https://forms.gle/YYptHbjsTy2J5BYA7"}">${"Project-Submission-Link"}</a>
// </p>

// <hr>

// <h3>📌 Important Instructions</h3>
// <ul>
// <li>Join the WhatsApp group immediately</li>
// <li>Start your training without delay</li>
// <li>Complete all assigned tasks on time</li>
// <li>Stay active and maintain communication</li>
// </ul>

// <hr>

// <p>
// We are confident that this internship will help you build strong technical skills 
// and give your career a great start.
// </p>

// <p>
// We look forward to working with you!
// </p>

// <br>

// <p>
// Best Regards,<br>
// <b>Gautam Kumar</b><br>
// HR & Manager<br>
// CodRexa
// </p>
// <hr>

// <p>
// 🌐 <a href="https://www.codrexa.in">www.codrexa.in</a><br>
// 📧 codrexa.hr@gmail.com<br>
// 📞 7300423846
// </p>
// </div>
// `, // cleaner email
//           attachments: [
//             {
//               filename: `${student.Name}_Internship_Offer.pdf`,
//               content: pdf,
//             },
//           ],
//         });
//         await page.close();
//       } catch (error) {
//         console.error(`❌ Error for ${student.Email}:`, error);
//       }
//     }

//     await browser.close();

//     res.status(200).json({
//       message: "✅ All offer letters sent successfully!",
//     });
//   } catch (error) {
//     await browser.close();
//     console.error("❌ Server Error:", error);

//     res.status(500).json({
//       message: "Something went wrong",
//     });
//   }
// });

// ===== SEND OFFERS ENDPOINT =====
app.post("/send-offers", async (req, res) => {
  const students = req.body.data;

  const browser = await puppeteer.launch({ headless: "new" });

  try {
    for (let student of students) {
      try {
        // ✅ Dynamic Duration
        const duration = student.Duration || student.duration || "";
        const durationText =
          student.DurationText ||
          student.durationText ||
          req.body.durationText ||
          req.body.durationType ||
          "Weeks";

        const finalDuration = `${duration} ${durationText}`;

        // ✅ PDF ke liye updated student data
        const updatedStudent = {
          ...student,
          Duration: duration,
          DurationText: durationText,
          FinalDuration: finalDuration,
        };

        const html = generateHTML(updatedStudent);

        const page = await browser.newPage();

        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdf = await page.pdf({
          format: "A4",
          printBackground: true,
          margin: {
            top: "0px",
            bottom: "0px",
            left: "0px",
            right: "0px",
          },
        });

        // 📩 Email Send
        await transporter.sendMail({
          from: `HR TEAM - CodRexa <${process.env.EMAIL_USER}>`,
          to: student.Email,
          subject: "Internship Offer Letter",
          html: `
<div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">

<p>Dear <b>${student.Name}</b>,</p>

<p>Congratulations 🎉</p>

<p>
  We are excited to offer you the position of <b>${student.Designation}</b> at 
  <b>CodRexa</b>.
</p>

<p><b>Intern ID:</b> ${student.InternID}</p>
<p><b>Duration:</b> ${finalDuration}</p>
<p><b>Date:</b> ${student.Date}</p>

<hr>

<h3>🚀 About CodRexa</h3>
<p>
CodRexa is a fast-growing organization focused on empowering students 
with real-world skills. We believe that learning should go beyond theory, and that's why 
our internship programs are designed to provide practical exposure, live projects, and 
industry-level experience.
</p>

<p>
Thousands of students across India are already part of CodRexa, building their careers 
with us. Now, it's your turn to grow, learn, and achieve something big 🚀
</p>

<hr>

<h3>🔗 Important Links</h3>

<p>
👉 <b>Start Your Training:</b><br>
<a href="https://drive.google.com/drive/folders/1QXe3hH5jf6OYh6wT0qad3MjmDdHfdVLZ?usp=sharing">
Access Your Course
</a>
</p>

<p>
👉 <b>Submit Your Tasks:</b><br>
<a href="https://forms.gle/YYptHbjsTy2J5BYA7">
Project-Submission-Link
</a>
</p>

<hr>

<h3>📌 Important Instructions</h3>
<ul>
<li>Join the WhatsApp group immediately</li>
<li>Start your training without delay</li>
<li>Complete all assigned tasks on time</li>
<li>Stay active and maintain communication</li>
</ul>

<hr>

<p>
We are confident that this internship will help you build strong technical skills 
and give your career a great start.
</p>

<p>We look forward to working with you!</p>

<br>

<p>
Best Regards,<br>
<b>Gautam Kumar</b><br>
HR & Manager<br>
CodRexa
</p>

<hr>

<p>
🌐 <a href="https://www.codrexa.in">www.codrexa.in</a><br>
📧 codrexa.hr@gmail.com<br>
📞 7300423846
</p>

</div>
`,
          attachments: [
            {
              filename: `${student.Name}_Internship_Offer.pdf`,
              content: pdf,
            },
          ],
        });

        await page.close();
      } catch (error) {
        console.error(`❌ Error for ${student.Email}:`, error);
      }
    }

    await browser.close();

    res.status(200).json({
      message: "✅ All offer letters sent successfully!",
    });
  } catch (error) {
    await browser.close();

    console.error("❌ Server Error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

// ===== SEND CERTIFICATES ENDPOINT =====
// app.post("/send-certificates", async (req, res) => {
//   const students = req.body.data;
//   const browser = await puppeteer.launch({ headless: "new" });

//   try {
//     for (let student of students) {
//       db.push(student);

//       const html = generateCertificateHTML(student);

//       const page = await browser.newPage();
//       await page.setContent(html, { waitUntil: "networkidle0" });

//       await page.setViewport({ width: 1000, height: 700 });

//       // await page.setViewport({
//       //   width: 1200,
//       //   height: 800
//       // });

//       // const pdf = await page.pdf({
//       //   printBackground: true,
//       //   width: "900px",
//       //   height: "680px",   // 🔥 थोड़ा बढ़ाया
//       //   pageRanges: "1",   // 🔥 ONLY 1 PAGE (IMPORTANT)
//       // });

//       await page.setViewport({
//         width: 1000,
//         height: 700,
//         deviceScaleFactor: 1,
//       });

//       const pdf = await page.pdf({
//         printBackground: true,
//         width: "860px",
//         height: "650px",
//         pageRanges: "1", // 🔥 only 1 page
//         margin: {
//           top: 0,
//           bottom: 0,
//           left: 0,
//           right: 0,
//         },
//       });
//       await transporter.sendMail({
//         from: `HR TEAM - CodRexa <${process.env.EMAIL_USER}>`,
//         to: student.Email,
//         subject: "Internship Certificate",
//         html: `
// <p>Dear ${student.Name},</p>

// <p>
// <strong>Congratulations 🎊</strong> on successfully completing your internship with <b>CodRexa Pvt Ltd</b>.
// </p>

// <p>
// We are delighted to acknowledge your dedication, hard work, and consistent efforts throughout the internship period. 
// Your performance and willingness to learn have been truly commendable.
// </p>

// <p>
// Please find attached your <b>Internship Certificate</b> as a recognition of your achievements.
// </p>

// <p>
// We wish you continued success and a bright future in your professional journey.
// </p>

// <br>

// <p>
// Warm regards,<br>
// <b>HR Team</b><br>
// CodRexa Pvt Ltd
// </p>
// `,
//         attachments: [
//           {
//             filename: `${student.Name}_Certificate.pdf`,
//             content: pdf,
//           },
//         ],
//       });

//       await page.close();
//     }

//     await browser.close();
//     res.json({ message: "Certificates Sent" });
//   } catch (err) {
//     await browser.close();
//     res.status(500).json({ error: err });
//   }
// });

app.post("/send-certificates", async (req, res) => {
  const students = req.body.data;

  const browser = await puppeteer.launch({ headless: "new" });

  try {
    for (let student of students) {
      try {
        // ✅ Dynamic Duration
        const duration = student.Duration || student.duration || "";

        const durationText =
          student.DurationText ||
          student.durationText ||
          req.body.durationText ||
          req.body.durationType ||
          "Weeks";

        const finalDuration = `${duration} ${durationText}`;

        // ✅ Updated student object
        const updatedStudent = {
          ...student,
          Duration: duration,
          DurationText: durationText,
          FinalDuration: finalDuration,
        };

        db.push(updatedStudent);

        // ✅ Ab generateCertificateHTML me student.FinalDuration chalega
        const html = generateCertificateHTML(updatedStudent);

        const page = await browser.newPage();

        await page.setContent(html, { waitUntil: "networkidle0" });

        await page.setViewport({
          width: 1000,
          height: 700,
          deviceScaleFactor: 1,
        });

        const pdf = await page.pdf({
          printBackground: true,
          width: "860px",
          height: "650px",
          pageRanges: "1",
          margin: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          },
        });

        await transporter.sendMail({
          from: `HR TEAM - CodRexa <${process.env.EMAIL_USER}>`,
          to: updatedStudent.Email,
          subject: "Internship Certificate",
          html: `
<p>Dear ${updatedStudent.Name},</p>

<p>
<strong>Congratulations 🎊</strong> on successfully completing your internship with <b>CodRexa Pvt Ltd</b>.
</p>

<p>
We are delighted to acknowledge your dedication, hard work, and consistent efforts throughout the internship period. 
Your performance and willingness to learn have been truly commendable.
</p>

<p>
Please find attached your <b>Internship Certificate</b> as a recognition of your achievements.
</p>

<p>
<b>Internship Duration:</b> ${finalDuration}
</p>

<p>
We wish you continued success and a bright future in your professional journey.
</p>

<br>

<p>
Warm regards,<br>
<b>HR Team</b><br>
CodRexa Pvt Ltd
</p>
`,
          attachments: [
            {
              filename: `${updatedStudent.Name}_Certificate.pdf`,
              content: pdf,
            },
          ],
        });

        await page.close();
      } catch (error) {
        console.error(`❌ Error for ${student.Email}:`, error);
      }
    }

    await browser.close();

    res.json({
      message: "Certificates Sent",
    });
  } catch (err) {
    await browser.close();

    console.error("❌ Certificate Server Error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});
// ===== SAVE EXCEL DATA (for testing) =====
app.post("/save-excel", (req, res) => {
  const data = req.body.data; // 🔥 clean keys (remove spaces)
  excelData = data.map((row) => {
    const fixed = {};
    Object.keys(row).forEach((key) => {
      fixed[key.trim()] = row[key];
    });
    return fixed;
  });
  console.log("Saved Rows:", excelData.length);
  res.json({ success: true });
});

// ===== DOWNLOAD PDF ENDPOINT (for testing) =====
app.post("/download-pdf", async (req, res) => {
  try {
    const student = req.body.student;

    // 🔥 DEBUG
    console.log("STUDENT DATA:", student);

    // ❌ अगर student नहीं आया
    if (!student) {
      return res.status(400).json({ error: "Student data missing" });
    }

    const name = student.Name || student.name || "Unknown";
    const domain = student.Domain || student.domain || "Unknown";

    const PDFDocument = require("pdfkit");
    const doc = new PDFDocument();

    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${name}.pdf`,
      });

      res.send(pdfData);
    });

    // 🔥 SAFE CONTENT
    doc.fontSize(20).text("Certificate", { align: "center" });
    doc.moveDown();

    doc.text(`Name: ${name}`);
    doc.text(`Domain: ${domain}`);

    doc.end();
  } catch (err) {
    console.log("🔥 PDF ERROR:", err);
    res.status(500).send("PDF error");
  }
});

app.post("/download-zip", async (req, res) => {
  try {
    const students = req.body.data;
    if (!students || students.length === 0) {
      return res.status(400).json({ error: "No data selected" });
    }
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=certificates.zip",
    );
    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);
    for (let student of students) {
      const pdfBuffer = await generatePDFBuffer(student);
      const fileName =
        (student.Name || "student").replace(/\s+/g, "_") + ".pdf";
      archive.append(pdfBuffer, { name: fileName });
    }
    await archive.finalize();
  } catch (err) {
    console.log("ZIP ERROR:", err);
    res.status(500).send("ZIP failed");
  }
});
// ================= VERIFY =================
app.get("/verify/:id", (req, res) => {
  const id = req.params.id.trim();
  console.log("VERIFY ID:", id);
  const student = excelData.find(
    (s) => String(s.CertificateID || s.certId || s.id || "").trim() === id,
  );
  if (!student) {
    return res.json({ success: false });
  }
  res.json({
    success: true,
    data: {
      name: student.Name || student.name || "N/A",
      domain: student.Domain || student.domain || "N/A",
    },
  });
});
// ===== START SERVER =====
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
