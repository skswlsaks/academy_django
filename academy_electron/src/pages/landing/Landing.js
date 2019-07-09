import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import {
  Badge,
  Button,
  Card,
  CardBody,
  CardImg,
  Col,
  Container,
  Row
} from "reactstrap";

import {
  Box,
  Chrome,
  Code,
  Download,
  Mail,
  Sliders,
  Smartphone
} from "react-feather";

import screenshotDashboardDefaultLarge from "../../assets/img/screenshots/dashboard-default-large.png";
import screenshotDashboardAnalyticsLarge from "../../assets/img/screenshots/dashboard-analytics-large.png";

import screenshotDashboardDefault from "../../assets/img/screenshots/dashboard-default.png";
import screenshotDashboardAnalytics from "../../assets/img/screenshots/dashboard-analytics.png";
import screenshotDashboardEcommerce from "../../assets/img/screenshots/dashboard-e-commerce.png";
import screenshotDashboardSocial from "../../assets/img/screenshots/dashboard-social.png";
import screenshotDashboardCrypto from "../../assets/img/screenshots/dashboard-crypto.png";
import screenshotComingSoon from "../../assets/img/screenshots/coming-soon.png";

import screenshotThemeClassic from "../../assets/img/screenshots/theme-classic.png";
import screenshotThemeModern from "../../assets/img/screenshots/theme-modern.png";
import screenshotThemeCorporate from "../../assets/img/screenshots/theme-corporate.png";

import brandBootstrap from "../../assets/img/brands/bootstrap.svg";
import brandSass from "../../assets/img/brands/sass.svg";
import brandWebpack from "../../assets/img/brands/webpack.svg";
import brandNpm from "../../assets/img/brands/npm.svg";
import brandReact from "../../assets/img/brands/react.svg";
import brandRedux from "../../assets/img/brands/redux.svg";

const Intro = () => (
  <section className="landing-intro pt-6 pt-xl-7">
    <Container>
      <Row>
        <Col md="12" lg="9" xl="11" className="mx-auto">
          <Row>
            <Col xl="5">
              <Box title="AppStack" className="landing-intro-brand" />

              <h1 className="text-white my-4">
                Start creating the best possible user experience for your
                customers.
              </h1>

              <p className="text-muted">
                A professional package that comes with plenty of UI components,
                forms, tables, charts, dashboards, pages and svg icons. Each one
                is fully customizable, responsive and easy to use.
              </p>

              <div className="my-4">
                <Link to="/auth/sign-in">
                  <Button color="light" size="lg" className="mr-2">
                    Login
                  </Button>
                </Link>
                <Link to="/auth/sign-up">
                  <Button color="light" size="lg" outline>
                    Register
                  </Button>
                </Link>
              </div>

              <div className="my-5">
                <div className="d-inline-block mr-3">
                  <h2 className="text-white">500+</h2>
                  <span className="text-muted">UI Components</span>
                </div>
                <div className="d-inline-block mr-3">
                  <h2 className="text-white">1500+</h2>
                  <span className="text-muted">SVG Icons</span>
                </div>
                <div className="d-inline-block">
                  <h2 className="text-white">45+</h2>
                  <span className="text-muted">Demo Pages</span>
                </div>
              </div>

              <div className="my-5">
                <img
                  src={brandBootstrap}
                  alt="Bootstrap"
                  width="40"
                  className="align-middle mr-2"
                />
                <img
                  src={brandSass}
                  alt="Sass"
                  width="40"
                  className="align-middle mr-2"
                />
                <img
                  src={brandWebpack}
                  alt="Webpack"
                  width="40"
                  className="align-middle mr-2"
                />
                <img
                  src={brandNpm}
                  alt="NPM"
                  width="40"
                  className="align-middle mr-2"
                />
                <img
                  src={brandReact}
                  alt="React"
                  width="40"
                  className="align-middle mr-2"
                />
                <img
                  src={brandRedux}
                  alt="Redux"
                  width="36"
                  className="align-middle mr-2"
                />
              </div>
            </Col>
            <Col xl="6" className="ml-auto d-none d-xl-block">
              <div className="landing-intro-img">
                <img
                  src={screenshotDashboardDefaultLarge}
                  className="landing-intro-img-default img-fluid"
                  alt="Dashboard Default"
                />
                <img
                  src={screenshotDashboardAnalyticsLarge}
                  className="landing-intro-img-analytics img-fluid"
                  alt="Dashboard Analytics"
                />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  </section>
);

const Styles = () => (
  <section className="py-6">
    <Container>
      <Row>
        <Col md="11" className="mx-auto text-center">
          <div className="mb-3">
            <h2>Available styles</h2>
            <p className="text-muted">
              Multiple color schemes available to make this template your very
              own.
            </p>
          </div>

          <Row>
            <Col md="6" lg="4" className="py-3">
              <Link to="/layouts/theme-classic">
                <Card className="mb-2 shadow-lg cursor-pointer">
                  <CardImg
                    top
                    src={screenshotThemeClassic}
                    alt="Classic Theme"
                  />
                </Card>
              </Link>
              <h4>Classic</h4>
            </Col>

            <Col md="6" lg="4" className="py-3">
              <Link to="/layouts/theme-modern">
                <Card className="mb-2 shadow-lg cursor-pointer">
                  <CardImg top src={screenshotThemeModern} alt="Modern Theme" />
                </Card>
              </Link>
              <h4>
                Modern{" "}
                <sup>
                  <Badge color="primary" tag="small">
                    New
                  </Badge>
                </sup>
              </h4>
            </Col>

            <Col md="6" lg="4" className="py-3">
              <Link to="/layouts/theme-corporate">
                <Card className="mb-2 shadow-lg cursor-pointer">
                  <CardImg
                    top
                    src={screenshotThemeCorporate}
                    alt="Corporate Theme"
                  />
                </Card>
              </Link>
              <h4>
                Corporate{" "}
                <sup>
                  <Badge color="primary" tag="small">
                    New
                  </Badge>
                </sup>
              </h4>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  </section>
);

const Dashboards = () => (
  <section className="py-6 bg-white">
    <Container>
      <Row>
        <Col md="11" className="mx-auto text-center">
          <div className="mb-3">
            <h2>Multiple dashboards</h2>
            <p className="text-muted">
              The package includes 5 unique dashboard pages.
            </p>
          </div>

          <Row>
            <Col md="6" lg="4" className="py-3">
              <Link to="/dashboard/default">
                <Card className="mb-2 shadow-lg cursor-pointer">
                  <CardImg
                    top
                    src={screenshotDashboardDefault}
                    alt="Default Dashboard"
                  />
                </Card>
              </Link>
              <h4>Default</h4>
            </Col>
            <Col md="6" lg="4" className="py-3">
              <Link to="/dashboard/analytics">
                <Card className="mb-2 shadow-lg cursor-pointer">
                  <CardImg
                    top
                    src={screenshotDashboardAnalytics}
                    alt="Analytics Dashboard"
                  />
                </Card>
              </Link>
              <h4>Analytics</h4>
            </Col>
            <Col md="6" lg="4" className="py-3">
              <Link to="/dashboard/e-commerce">
                <Card className="mb-2 shadow-lg cursor-pointer">
                  <CardImg
                    top
                    src={screenshotDashboardEcommerce}
                    alt="E-commerce Dashboard"
                  />
                </Card>
              </Link>
              <h4>E-commerce</h4>
            </Col>
            <Col md="6" lg="4" className="py-3">
              <Link to="/dashboard/social">
                <Card className="mb-2 shadow-lg cursor-pointer">
                  <CardImg
                    top
                    src={screenshotDashboardSocial}
                    alt="Social Dashboard"
                  />
                </Card>
              </Link>
              <h4>Social</h4>
            </Col>
            <Col md="6" lg="4" className="py-3">
              <Link to="/dashboard/crypto">
                <Card className="mb-2 shadow-lg cursor-pointer">
                  <CardImg
                    top
                    src={screenshotDashboardCrypto}
                    alt="Crypto Dashboard"
                  />
                </Card>
              </Link>
              <h4>
                Crypto{" "}
                <sup>
                  <Badge color="primary" tag="small">
                    New
                  </Badge>
                </sup>
              </h4>
            </Col>
            <Col md="6" lg="4" className="py-3">
              <Card className="mb-2 shadow-lg">
                <CardImg top src={screenshotComingSoon} alt="Coming soon" />
              </Card>
              <h4>More coming soon</h4>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  </section>
);

const Features = () => (
  <section className="py-6">
    <Container>
      <Row>
        <Col md="10" className="mx-auto text-center">
          <div className="mb-3">
            <h2>Features</h2>
            <p className="text-muted">
              A responsive dashboard built for everyone who wants to create
              webapps on top of Bootstrap.
            </p>
          </div>

          <Row>
            <Col md="6" lg="4">
              <div className="my-4">
                <Smartphone className="landing-features-icon" />
                <h5 className="mt-2 font-weight-bold">Responsive</h5>

                <p className="text-muted">
                  With mobile, tablet & desktop support it doesn't matter what
                  device you're using. Our themes are responsive in all
                  browsers.
                </p>
              </div>
            </Col>
            <Col md="6" lg="4">
              <div className="my-4">
                <Sliders className="landing-features-icon" />
                <h5 className="mt-2 font-weight-bold">Customizable</h5>

                <p className="text-muted">
                  You don't need to be an expert to customize our themes. Our
                  code is very readable and well documented.
                </p>
              </div>
            </Col>
            <Col md="6" lg="4">
              <div className="my-4">
                <Mail className="landing-features-icon" />
                <h5 className="mt-2 font-weight-bold">Quick support</h5>

                <p className="text-muted">
                  Our themes are supported by specialists who provide quick and
                  effective support. Usually an email reply takes &lt;24h.
                </p>
              </div>
            </Col>
            <Col md="6" lg="4">
              <div className="my-4">
                <Chrome className="landing-features-icon" />
                <h5 className="mt-2 font-weight-bold">Cross browser</h5>

                <p className="text-muted">
                  Our themes are working perfectly with: Chrome, Firefox,
                  Safari, Opera and IE 10+. We're working hard to support them.
                </p>
              </div>
            </Col>
            <Col md="6" lg="4">
              <div className="my-4">
                <Code className="landing-features-icon" />
                <h5 className="mt-2 font-weight-bold">Clean code</h5>

                <p className="text-muted">
                  We strictly followed Bootstrap's guidelines to make your
                  integration as easy as possible. All code is handwritten.
                </p>
              </div>
            </Col>
            <Col md="6" lg="4">
              <div className="my-4">
                <Download className="landing-features-icon" />
                <h5 className="mt-2 font-weight-bold">Free updates</h5>

                <p className="text-muted">
                  From time to time you'll receive an update containing new
                  components, improvements and bugfixes.
                </p>
              </div>
            </Col>
          </Row>

          <Link to="/documentation">
            <Button color="primary" size="lg">
              Documentation
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  </section>
);

const Testimonials = () => (
  <section className="py-6 bg-white">
    <Container>
      <Row>
        <Col md="9" className="mx-auto text-center">
          <div className="mb-4">
            <h2>Testimonials</h2>
            <p className="text-muted">
              What others are saying about AppStack ReactJS.
            </p>
          </div>

          <Card className="bg-light border-0">
            <CardBody>
              <blockquote className="blockquote mb-0">
                <p className="mb-2">
                  Seeing the file structure of the code is enough to know that
                  this was a properly cared for and loved project. The react
                  project is easy to understand and modify, and everything is so
                  properly set up that any new additions I'd make would feel
                  like a native extension of the theme versus a simple hack. If
                  you ever need inspiration, the example pages are plentiful and
                  varied, I definitely feel like this will save me hundredths of
                  hours I'd otherwise spend on designing (with a subpar
                  outcome).
                </p>
                <footer className="blockquote-footer">
                  Alejandro at{" "}
                  <cite title="Bootstrap Themes">Bootstrap Themes</cite>
                </footer>
              </blockquote>
            </CardBody>
          </Card>
          <Card className="bg-light border-0">
            <CardBody>
              <blockquote className="blockquote mb-0">
                <p className="mb-2">
                  We are totally amazed with a simplicity and the design of
                  AppStack. Nice and clean. Easy to integrate in our React-apps
                  stack. Probably saved us hundreds of hours of development. We
                  are an Enterprise customer and absolutely amazed with the
                  support Bootlab has provided us. Totally recommended to
                  anyone: private or enterprise business, if you count your
                  money and really need "noBS" and beautiful solution. AppStack
                  rocks!
                </p>
                <footer className="blockquote-footer">
                  Nikita at{" "}
                  <cite title="Bootstrap Themes">Bootstrap Themes</cite>
                </footer>
              </blockquote>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  </section>
);

const Footer = () => (
  <section className="py-5">
    <Container className="text-center">
      <h2 className="mb-0">
        Trusted by over 2500+ customers world wide
        <a
          href="https://themes.getbootstrap.com/product/appstack-responsive-admin-template/"
          target="_blank"
          rel="noopener noreferrer"
          className="align-middle btn btn-primary btn-lg ml-2 mt-n1"
        >
          Buy now
        </a>
      </h2>
    </Container>
  </section>
);

class Landing extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Intro />
        <Styles />
        <Dashboards />
        <Features />
        <Testimonials />
        <Footer />
      </React.Fragment>
    );
  }
}

export default connect()(Landing);
