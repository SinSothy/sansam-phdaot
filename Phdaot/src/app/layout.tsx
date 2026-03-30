type Props = {
  children: React.ReactNode;
};

// Since we have a `[locale]` layout, the root layout structure is defined there.
// This root layout acts as a pass-through for the children.
export default function RootLayout({ children }: Props) {
  return children;
}

