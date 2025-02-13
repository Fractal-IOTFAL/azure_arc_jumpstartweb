import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Home } from './Home';
import NavBar from './components/navigation/NavBar';
import MenuDrawer from './components/navigation/menu/MenuDrawer';
import { MarkdownPage } from './MarkdownPage';
import Dropdown from './components/navigation/dropdown/Dropdown';
import { Breadcrumbs } from './components/navigation/breadcrumbs/Breadcrumbs';
import { extractRoutes } from './components/Utility';
import './App.css';
import sideMenuData from './data/side-menu.json';
import menuDrawerData from './data/menu-drawer.json';
import SideMenu from './components/navigation/sidemenu/SideMenu';

function App() {
    const [pathNode, setPathNode] = useState(sideMenuData);
    const [currentPathNode, setCurrentPathNode] = useState({});
    const [dynamicRoutes, setDynamicRoutes] = useState([]);
    const [menuItems, setMenuItems] = useState(menuDrawerData);
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [sections, setSections] = useState([]);
    const pageRef = useRef(null);

    // page composition
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
    const toggleSideMenu = () => {
        setIsSideMenuOpen(!isSideMenuOpen);
    };
    const toggleMenuDrawer = (menuItem) => {
        setSelectedMenuItem(menuItem);
        setIsMenuDrawerOpen(menuItem ? true : false);
    };

    const sideMenuLeft = isSideMenuOpen ? 0 : -300;
    const mainContentWidth = isSideMenuOpen ? 'calc(100% - 300px)' : '100%';
    const menuDrawerTop = isMenuDrawerOpen ? 0 : -300;
    const [isSplashPage, setIsSplashPage] = useState(true);

    useEffect(() => {
        sortNodeTree(pathNode);
        setCurrentPathNode(pathNode);
        setDynamicRoutes(extractRoutes(pathNode));
    }, []);

    const sortNodeTree = (node) => {
        if (node.children) {
            node.children.sort((a, b) => {
                const aWeight = a.frontMatter && a.frontMatter.weight ? a.frontMatter.weight : 0;
                const bWeight = b.frontMatter && b.frontMatter.weight ? b.frontMatter.weight : 0;
                if (aWeight < bWeight) {
                    return -1;
                } else if (aWeight > bWeight) {
                    return 1;
                } else {
                    return 0;
                }
            });
            node.children.forEach((child) => {
                sortNodeTree(child);
            });
        }
    }

    const updateBreadcrumbs = (node) => {
        const breadcrumbs = [];

        let currentNode = node;
        while (currentNode) {
            if (currentNode.frontMatter) {
                if (currentNode.frontMatter.linkTitle) {
                    breadcrumbs.push({
                        name: currentNode.frontMatter.linkTitle,
                        href: currentNode.path
                    });
                } else if (currentNode.frontMatter.title) {
                    breadcrumbs.push({
                        name: currentNode.frontMatter.title,
                        href: currentNode.path
                    });
                } else {
                    breadcrumbs.push({
                        name: currentNode.path,
                        href: currentNode.path
                    });
                }
            }
            currentNode = currentNode.parent;
        }

        console.log(breadcrumbs);

        setBreadcrumbs(breadcrumbs);
    }

    const updateSections = () => {
        if (pageRef.current) {
            const elementsWithId = pageRef.current.querySelectorAll('h2[id]');
            const discoveredSections = Array.from(elementsWithId).map(el => ({
                id: el.id,
                name: el.innerText,
                href: `#${el.id}`
            }));
            setSections(discoveredSections);
        }
    }

    const findNode = (node, path) => {
        if (node.path.replace('\\', '/') === path.replace('\\', '/')) {
            return node;
        } else if (node.children) {
            let result = null;
            for (let i = 0; result == null && i < node.children.length; i++) {
                result = findNode(node.children[i], path);
            }
            return result;
        }
        return null;
    }

    const locatation = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
        console.log(locatation.pathname);
        // is the path for the link internal or external?
        if (locatation.pathname.startsWith('/')) {
            // internal
            console.log('internal');
            const pathParts = locatation.pathname.split('/');
            console.log(pathParts);
            let currentNode = pathNode;
            // find child of currentNode with a path that matches the first part of the path
        } else {
            // external
            console.log('external');
        }

        // is splash or markdown page
        if (locatation.pathname === '/') {
            setIsSplashPage(true);
            setIsSideMenuOpen(false);
        } else {
            setIsSplashPage(false);
            setIsSideMenuOpen(true);
        }

        // console.log(findNode(pathNode, locatation.pathname));
    }, [locatation]);

    return (
        <div ref={pageRef}>
            {/* Nav Bar */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '5vh',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 20px',
                    zIndex: 4
                }}
            >
                <NavBar
                    menuItems={menuItems}
                    selectedMenuItem={selectedMenuItem}
                    setSelectedMenuItem={toggleMenuDrawer}
                />
            </div>
            {/* Breadcrumbs and Jump to section dropdown */}
            {
                !isSplashPage && (
                    <div
                        style={{
                            background: '#0a0a0a',
                            display: 'grid',
                            gridTemplateColumns: 'auto auto',
                            justifyContent: 'space-between',
                            position: 'fixed',
                            top: '48px',
                            left: '0px',
                            right: '0px',
                            height: '52px',
                            paddingLeft: '10px',
                            paddingRight: '10px',
                            zIndex: 1,
                        }}
                    >
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                        <Dropdown items={sections} />
                    </div>
                )
            }
            {/* Menu Drawer */}
            <div
                style={{
                    position: 'fixed',
                    top: isMenuDrawerOpen ? 0 : -300,
                    left: 0,
                    right: 0,
                    height: 300,
                    opacity: isMenuDrawerOpen ? 1 : 0,
                    zIndex: isMenuDrawerOpen ? 3 : -3,
                    transition: 'all 0.5s'
                }}
            >
                {selectedMenuItem && <MenuDrawer menuItem={selectedMenuItem} setIsMenuDrawerOpen={setIsMenuDrawerOpen} setSelectedMenuItem={setSelectedMenuItem} />}
            </div>
            {/* Side Menu */}
            {
                !isSplashPage && (

                    <div
                        style={{
                            position: 'fixed',
                            top: 100,
                            left: sideMenuLeft,
                            width: 300,
                            height: 500,
                            zIndex: 1,
                            transition: 'all 0.5s',
                            overflow: 'auto',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',

                        }}
                    >
                        <SideMenu pathNode={currentPathNode}></SideMenu>
                        <span
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: isSideMenuOpen ? 0 : -65,
                                zIndex: 1,
                                transition: 'right 0.5s',
                            }}
                            onClick={toggleSideMenu}
                        >
                            <svg
                                style={{
                                    transform: isSideMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'all 0.5s',
                                }}
                                width="32"
                                height="24"
                                viewBox="0 0 32 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M19.7071 4.29289C20.0976 4.68342 20.0976 5.31658 19.7071 5.70711L13.4142 12L19.7071 18.2929C20.0976 18.6834 20.0976 19.3166 19.7071 19.7071C19.3166 20.0976 18.6834 20.0976 18.2929 19.7071L11.2929 12.7071C10.9024 12.3166 10.9024 11.6834 11.2929 11.2929L18.2929 4.29289C18.6834 3.90237 19.3166 3.90237 19.7071 4.29289Z"
                                    fill="white"
                                />
                            </svg>
                        </span>
                    </div>
                )
            }
            {/* Markdown Pages */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: isSplashPage ? '0px' : '100px',
                    zIndex: -1
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        position: 'relative'
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            left: isSideMenuOpen ? 300 : 0,
                            right: 0,
                            overflow: 'auto',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            transition: 'all 0.5s'
                        }}
                    >
                        <div
                            style={{
                                margin: '0 20px'
                            }}
                        >
                            <Routes>
                                <Route path="/" element={<Home />} />
                                {dynamicRoutes.map(route => (
                                    <Route
                                        key={route.path}
                                        path={route.path}
                                        element={<MarkdownPage node={pathNode} path={route.path} updateBreadcrumbs={updateBreadcrumbs} updateSections={updateSections} />}
                                    />
                                ))}
                            </Routes>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
