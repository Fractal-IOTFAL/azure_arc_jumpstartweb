import React, { useState } from "react";
import { Link } from 'react-router-dom';
import "./SideMenu.css";

const hideNode = (pathNode) => {
  // if pathNode has a frontMatter property with a toc_hide property set to true, then filter it out
  if (pathNode.frontMatter && pathNode.frontMatter.toc_hide) {
    return true;
  }
}

const SideMenu = ({ pathNode }) => {
  return (
    <div
      className="side-menu-container"
      style={{
        paddingBottom: 20
      }}
    >
      <div className="side-menu-contents">
        {
          pathNode.children && pathNode.children
            .slice(1, 5)
            .filter((pn) => {
              return !pn.path.includes('\\img') && !hideNode(pn);
            })
            .map((childNode) => {
              return <SideMenuHeader node={childNode} />;
            })
        }
      </div>
    </div>
  );
};

const SideMenuHeader = ({ node, margin = 0 }) => {
  const title = node.frontMatter.linkTitle || node.frontMatter.title || node.path;
  const [showChildren, setShowChildren] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="side-menu-section">
      <div
        className="side-menu-section-header"
        onClick={() => setShowChildren(!showChildren)}
        style={{ cursor: 'pointer' }}
      >
        <div className="side-menu-menu-section-header">
          <div className="side-menu-left-lockup">
            <div className="side-menu-header-text">{title} </div>
          </div>
        </div>
        <div className="side-menu-frame-2018775855">
          <svg
            className="side-menu-chevron"
            style={{
              transform: `rotate(${showChildren ? '-180deg' : '0deg'})`
            }}
            width="8"
            height="4"
            viewBox="0 0 8 4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0.5 0L4 4" stroke="#D6D6D6" strokeLinecap="round" />
            <path d="M4 4L7.5 0" stroke="#D6D6D6" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      {
        showChildren && hasChildren && (
          <SideMenuItem
            node={{
              frontMatter: {
                title: 'Overview'
              },
              path: node.path
            }}
            margin={margin + 10}
          />
        )
      }
      {
        showChildren && hasChildren && node.children
          .filter((np) => {
            return !np.path.includes('\\img') && !np.path.includes('/img') && !hideNode(np);
          })
          .map((childNode) => {
            return <SideMenuItem node={childNode} margin={10} />;
          })
      }
    </div>
  );
}

const SideMenuItem = ({ node, margin = 0 }) => {
  const title = node.frontMatter.linkTitle || node.frontMatter.title || node.path;
  const [showChildren, setShowChildren] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const content = (
    <div
      className="side-menu-start-content"
      style={{
        marginLeft: margin,
        cursor: 'pointer'
      }}
      onClick={() => setShowChildren(!showChildren)}
    >
      <svg
        className="side-menu-regular-icon"
        style={{
          transform: `rotate(${showChildren ? '90deg' : '0deg'})`,
          opacity: hasChildren ? 1 : 0
        }}
        width="16"
        height="21"
        viewBox="0 0 16 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 16C10.7614 16 13 13.7614 13 11C13 8.23858 10.7614 6 8 6C5.23858 6 3 8.23858 3 11C3 13.7614 5.23858 16 8 16ZM14 11C14 14.3137 11.3137 17 8 17C4.68629 17 2 14.3137 2 11C2 7.68629 4.68629 5 8 5C11.3137 5 14 7.68629 14 11ZM7.35355 8.14645L9.85355 10.6464C10.0488 10.8417 10.0488 11.1583 9.85355 11.3536L7.35355 13.8536C7.15829 14.0488 6.84171 14.0488 6.64645 13.8536C6.45118 13.6583 6.45118 13.3417 6.64645 13.1464L8.79289 11L6.64645 8.85355C6.45118 8.65829 6.45118 8.34171 6.64645 8.14645C6.84171 7.95118 7.15829 7.95118 7.35355 8.14645Z"
          fill="#D6D6D6"
        />
      </svg>
      <div className="side-menu-content-frame">
        <div className="side-menu-list-item-text">{title} </div>
      </div>
    </div>

  );

  return (
    <>
      <div className="side-menu-item">
        {
          !hasChildren ? (
            <Link to={node.path}>
              {content}
            </Link>
          ) : (
            content
          )
        }
      </div>
      {
        showChildren && hasChildren && (
          <SideMenuItem
            node={{
              frontMatter: {
                title: 'Overview'
              },
              path: node.path
            }}
            margin={margin + 10}
          />
        )
      }
      {
        showChildren && hasChildren && node.children
        .filter((np) => {
          return !np.path.includes('\\img') && !hideNode(np);
        })
        .map((childNode) => {
          return <SideMenuItem node={childNode} margin={margin + 10} />;
        })
      }
    </>
  );
}

export default SideMenu;