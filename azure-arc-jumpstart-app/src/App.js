import React, { useEffect, useState } from 'react';
import './App.css';
import NavBar from './components/navigation/NavBar';
import BreadcrumbBar from './components/navigation/breadcrumbs/BreadcrumbBar';
import MenuDrawer from './components/navigation/menu/MenuDrawer';
import Dropdown from './components/navigation/dropdown/Dropdown';
import { SideMenu } from './components/navigation/sidemenu/SideMenu';
import Doc from './components/Doc';

const App = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [sideMenuItems, setSideMenuItems] = useState([]);
  const [selectedSideMenuItem, setSelectedSideMenuItem] = useState(null);
  const [markdownFileContents, setMarkdownFileContents] = useState('');
  const [markdownFilePath, setMarkdownFilePath] = useState('');
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const fetchMenuDrawerData = async () => {
      const response = await fetch('./menu-drawer.json');
      const menuItems = await response.json();
      setMenuItems(menuItems);
    };

    const fetchSideMenuData = async () => {
      const response = await fetch('./side-menu.json');
      const data = await response.json();
      const sideMenuItems = data.hasOwnProperty('children') && data.children.length > 0 ? data.children : [];
      setSideMenuItems(sideMenuItems);
    };

    fetchMenuDrawerData();
    fetchSideMenuData();
  }, []);

  const removeFrontmatter = (text) => {
    const frontmatterPattern = /^---\s*[\s\S]*?---\s*/;
    const textWithoutFrontmatter = text.replace(frontmatterPattern, '');

    return textWithoutFrontmatter;
  }

  const handleFileFetch = (pagePath) => {
    const pagePathSplit = pagePath.split('#');
    setMarkdownFilePath(pagePathSplit);
    getDoc(pagePathSplit);
  }

  const getDoc = async (path) => {
    try {
      const pathWithForwardSlashes = path[0].replace(/\\/g, '/');
      let fullPath = path[0] === '' ? './docs/_index.md' : `./docs/${pathWithForwardSlashes}/_index.md`;
      if (path.length > 1) {
        fullPath = `${fullPath}#${path[1]}`;
      }
      const res = await fetch(fullPath);
      const doc = await res.text();
      const htmlText = removeFrontmatter(doc);
      if (fullPath.includes('azure_arc_jumpstart/')) {
        const node = findNode(sideMenuItems[0], path[0]);
        setSelectedSideMenuItem((prev) => {
          if (node && node.children && node.children.length > 0) {
            console.log(node.children.length);
            let htmlContent = '';
            // for each child
            node.children.forEach((child) => {
              htmlContent = `${htmlContent}${createHtml(child)}`;
            });

            console.log(htmlContent);
            setMarkdownFileContents(htmlContent);
          } else {
            setMarkdownFileContents(htmlText);
          }

          return node;
        });
      } else {
        setMarkdownFileContents(htmlText);
      }
    } catch (e) {
      console.log(e);
    }
  }

  // function to create html using frontmatter in node, include title or linkTitle and description
  const createHtml = (node) => {
    let html = '';
    if (node.frontMatter) {
      if (node.frontMatter.title) {
        html = `<a href='${node.path}'>${node.frontMatter.title}</a>`;
      } else if (node.frontMatter.linkTitle) {
        html = `<a href='${node.path}'>${node.frontMatter.linkTitle}</a>`;
      }
      if (node.frontMatter.description) {
        html = `${html}<p>${node.frontMatter.description}</p>`;
      } else {
        html = `${html}<p></p>`;
      }
    }
    return html;
  }

  // sideMenuItems is a node tree.  each node has a path property.  a function to find the node with the path.
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

  const onChange = (e) => {
    const hash = e.target.value;
    const targetElement = document.getElementById(hash);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const gatherElementIds = () => {
    const elementIds = [];

    const docElement = document.getElementById('doc');
    const elementsWithIds = docElement.querySelectorAll('[id]');

    elementsWithIds.forEach((element) => {
      elementIds.push(element.id);
    });

    setBookmarks(elementIds);
  };

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '300px auto',
          justifyContent: 'space-between',
          zIndex: '-1'
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '96px',
            left: '0px',
            bottom: '0px',
            // scroll without visible scroll bars
            overflowY: 'scroll',
            // hide scroll bars
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          }}
        >
          {
            sideMenuItems && sideMenuItems.length > 0 && (
              <SideMenu
                sideMenuItems={sideMenuItems}
                handleFileFetch={handleFileFetch}
              />
            )
          }
        </span>
        <span
          id="doc"
          style={{
            position: 'absolute',
            top: '96px',
            left: '300px',
            right: '10px',
            bottom: '0px',
            color: 'white',
            overflowY: 'scroll',
            // hide scroll bars
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          }}>
          <Doc
            doc={markdownFileContents}
            path={markdownFilePath}
            handleFileFetch={handleFileFetch}
            gatherElementIds={gatherElementIds}
          />
        </span>
      </div>
      <NavBar
        menuItems={menuItems}
        selectedMenuItem={selectedMenuItem}
        setSelectedMenuItem={setSelectedMenuItem}
      />
      {
        selectedMenuItem ? (
          <MenuDrawer
            menuItem={selectedMenuItem}
            handleFileFetch={handleFileFetch}
          />
        ) : (
          <>
            <BreadcrumbBar
              path={markdownFilePath}
              handleFileFetch={handleFileFetch}
            />
            <span style={{ position: 'absolute', top: '48px', right: '71px' }}>
              <Dropdown
                bookmarks={bookmarks}
                markdownFilePath={markdownFilePath}
                handleFileFetch={handleFileFetch}
              >
                Jump to section
              </Dropdown>
            </span>
          </>
        )
      }
    </>
  );
}

export default App;
