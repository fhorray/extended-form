import { Button } from '@/components/ui/button';
import { NodeViewWrapper } from '@tiptap/react';
import { CopyIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import * as shiki from 'shiki';
import { toast } from 'sonner';

export const CustomCodeBlockComponent = (props: any) => {
  const [html, setHtml] = useState('');
  const code = props.node.textContent;
  const language = props.node.attrs.language || 'bash';

  useEffect(() => {
    const load = async () => {
      const highlighter = await shiki.createHighlighter({
        themes: ['nord'],
        langs: ['bash'],
      });

      const html = highlighter.codeToHtml(code, {
        lang: 'bash',
        theme: 'nord',
      });

      setHtml(html);
    };
    load();
  }, [code, language]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    toast.success('Copied to clipborad!');
  };

  return (
    <NodeViewWrapper className="relative group">
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        className="rounded-md p-4 overflow-auto bg-[#2e3440]"
      />
      <Button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 hidden group-hover:block bg-black text-white text-sm px-2 py-1 rounded"
      >
        <CopyIcon />
      </Button>
    </NodeViewWrapper>
  );
};
