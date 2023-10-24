import React, { useState, useEffect } from 'react';
import Markdown from 'markdown-to-jsx';
import { Heading1 } from './components/Overrides//Heading1';
import { Heading2 } from './components/Overrides//Heading2';
import { Heading3 } from './components/Overrides//Heading3';
import { Heading4 } from './components/Overrides//Heading4';
import { Heading5 } from './components/Overrides//Heading5';
import { Heading6 } from './components/Overrides//Heading6';
import { Paragraph } from './components/Overrides//Paragraph';
import { Anchor } from './components/Overrides//Anchor';
import { Image } from './components/Overrides//Image';
import { List } from './components/Overrides//List';
import { OrderedList } from './components/Overrides//OrderedList';
import { ListItem } from './components/Overrides//ListItem';
import { InlineCode } from './components/Overrides//InlineCode';
import { CodeBlock } from './components/Overrides//CodeBlock';
import { Blockquote } from './components/Overrides//Blockquote';
import { Table } from './components/Overrides//Table';
import { TableRow } from './components/Overrides//TableRow';
import { TableHeader } from './components/Overrides//TableHeader';
import { TableCell } from './components/Overrides//TableCell';
import { ThematicBreak } from './components/Overrides//ThematicBreak';
import { Bold } from './components/Overrides//Bold';
import { Italics } from './components/Overrides//Italics';
import EditInGitHub from './components/markdown/EditInGitHub';
import './MarkdownPage.css';

export function MarkdownPage({ node, path, updateBreadcrumbs, updateSections }) {
    const viewBasePath = 'https://raw.githubusercontent.com/Azure/arc_jumpstart_docs/main/docs/';
    const editBasePath = 'https://github.com/Azure/arc_jumpstart_docs/blob/main/docs/';
    const [markdown, setMarkdown] = useState('');

    const removeFrontmatter = (text) => {
        return text.replace(/---[\s\S]*?---/, '');
    };

    useEffect(() => {
        async function getMarkdown(currentNode) {
            const fullPath = `${viewBasePath}${path}/_index.md`;
            const response = await fetch(fullPath);
            const text = await response.text();
            const markdown = removeFrontmatter(text);
            if (path.includes('azure_arc_jumpstart/')) {
                if (currentNode && currentNode.children && currentNode.children.length > 0) {
                    let htmlContent = createHtml(currentNode);
                    // for each child
                    currentNode.children.forEach((child) => {
                        htmlContent = `${htmlContent}${createHtml(child)}`;
                    });

                    setMarkdown(htmlContent);
                } else {
                    setMarkdown(markdown);
                }
            } else {
                setMarkdown(markdown);
            }
        }
        
        const currentNode = findNode(node, path);
        updateBreadcrumbs(currentNode);
        getMarkdown(currentNode);
    }, [path]);

    useEffect(() => {
        if (markdown) {
            updateSections();
        }
    }, [markdown]);

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

    return (
        <div className='markdown-page-container'>
            <div className='markdown-page'>
                <span style={{
                    position: 'absolute',
                    top: '20px',
                    right: '50px',
                }}>
                    <EditInGitHub href={`${editBasePath}${path}/_index.md`}></EditInGitHub>
                </span>
                <Markdown
                    options={{
                        overrides: {
                            a: (props) => <Anchor {...props} path={path} />,
                            blockquote: Blockquote,
                            code: InlineCode,
                            em: Italics,
                            h1: Heading1,
                            h2: Heading2,
                            h3: Heading3,
                            h4: Heading4,
                            h5: Heading5,
                            h6: Heading6,
                            hr: ThematicBreak,
                            img: (props) => <Image {...props} basePath={viewBasePath} path={path} />,
                            li: ListItem,
                            ol: OrderedList,
                            p: Paragraph,
                            pre: CodeBlock,
                            strong: Bold,
                            table: Table,
                            td: TableCell,
                            th: TableHeader,
                            tr: TableRow,
                            ul: List
                        }
                    }}
                >
                    {markdown}
                </Markdown>
            </div>
        </div>
    );
}
