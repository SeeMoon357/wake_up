import { readFile } from 'fs/promises';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

function normalizeImageSrc(raw: string): string {
  const cleaned = raw.replace(/^\.\//, '');
  const encodedPath = cleaned
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `/guide-assets/${encodedPath}`;
}

function textToId(text: string, index: number): string {
  const normalized = text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '');
  return normalized ? `sec-${normalized}-${index}` : `sec-${index}`;
}

function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split('\n');
  const toc: TocItem[] = [];
  let idx = 0;

  for (const raw of lines) {
    const line = raw.trim();
    const h2 = line.match(/^##\s+(.*)$/);
    if (h2 && h2[1]) {
      toc.push({ id: textToId(h2[1], idx++), text: h2[1], level: 2 });
      continue;
    }

    const h3 = line.match(/^###\s+(.*)$/);
    if (h3 && h3[1]) {
      toc.push({ id: textToId(h3[1], idx++), text: h3[1], level: 3 });
    }
  }

  return toc;
}

export default async function GuidePage() {
  const docPath = path.join(process.cwd(), 'doc', '使用手册.md');
  const markdown = await readFile(docPath, 'utf8');
  const toc = extractToc(markdown);
  let h2Index = 0;
  let h3Index = 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">使用指南</h1>
          <a
            href="/"
            className="text-sm px-3 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50"
          >
            返回首页
          </a>
        </div>

        <div className="relative xl:pl-56">
          <aside className="hidden xl:block absolute left-0 top-0 w-52">
            <div className="card sticky top-24">
              <h2 className="text-sm font-bold text-gray-900 mb-3">目录</h2>
              <nav className="space-y-2">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block text-sm text-gray-700 hover:text-primary-600 ${
                      item.level === 3 ? 'pl-3' : ''
                    }`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <article className="card prose prose-gray max-w-4xl mx-auto prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-hr:border-gray-200">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">{children}</h1>
                ),
                h2: ({ children }) => {
                  const item = toc.filter((t) => t.level === 2)[h2Index];
                  h2Index += 1;
                  return (
                    <h2 id={item?.id} className="text-2xl font-bold text-gray-900 mt-8 mb-3 scroll-mt-24">
                      {children}
                    </h2>
                  );
                },
                h3: ({ children }) => {
                  const item = toc.filter((t) => t.level === 3)[h3Index];
                  h3Index += 1;
                  return (
                    <h3 id={item?.id} className="text-xl font-semibold text-gray-800 mt-6 mb-2 scroll-mt-24">
                      {children}
                    </h3>
                  );
                },
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
      </div>
    </main>
  );
}
