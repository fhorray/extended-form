import {
  AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon, BanIcon, Heading1Icon, Heading2Icon, Heading3Icon, Heading4Icon, Heading5Icon, Heading6Icon, BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeIcon,
} from "lucide-react";
import { Level } from "./types";

export const headingIcons = {
  1: Heading1Icon,
  2: Heading2Icon,
  3: Heading3Icon,
  4: Heading4Icon,
  5: Heading5Icon,
  6: Heading6Icon,
};

export const textAlignIcons = {
  'left': AlignLeftIcon,
  'center': AlignCenterIcon,
  'right': AlignRightIcon,
  'justify': AlignJustifyIcon,
  'unset': BanIcon
}

export const textFormatIcons = {
  bold: BoldIcon,
  italic: ItalicIcon,
  underline: UnderlineIcon,
  strike: StrikethroughIcon,
  code: CodeIcon,
  'code-block': CodeIcon,
};


export const headingShortcutKeys: Partial<Record<Level, string>> = {
  1: 'Ctrl-Alt-1',
  2: 'Ctrl-Alt-2',
  3: 'Ctrl-Alt-3',
  4: 'Ctrl-Alt-4',
  5: 'Ctrl-Alt-5',
  6: 'Ctrl-Alt-6',
};
