import { readFile } from 'fs/promises';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function normalizeImageSrc(raw: string): string {
  const cleaned = raw.replace(/^\.\//, '');
  const encodedPath = cleaned
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `/guide-assets/${encodedPath}`;
}

export default async function GuidePage() {
  const docPath = path.join(process.cwd(), 'doc', '使用手册.md');
  const markdown = await readFile(docPath, 'utf8');

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">使用指南</h1>
          <a
            href="/"
            className="text-sm px-3 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50"
          >
            返回首页
          </a>
        </div>

        <article className="card prose prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-hr:border-gray-200">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-gray-700 leading-7 my-3 break-words">{children}</p>
              ),
              hr: () => <hr className="border-gray-200 my-6" />,
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 space-y-2 text-gray-700 my-3">{children}</ol>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 space-y-2 text-gray-700 my-3">{children}</ul>
              ),
              li: ({ children }) => <li className="leading-7">{children}</li>,
              a: ({ href = '', children }) => (
                <a
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  {children}
                </a>
              ),
              strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
              img: ({ src = '', alt = '' }) => (
                <img
                  src={normalizeImageSrc(src)}
                  alt={alt}
                  className="w-full rounded-xl border border-gray-200 shadow-sm my-4"
                  loading="lazy"
                />
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </article>
      </div>
    </main>
  );
}
