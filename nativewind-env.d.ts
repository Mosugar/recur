/// <reference types="nativewind/types" />

// Allow importing CSS files (NativeWind global.css)
declare module '*.css' {
  const content: string;
  export default content;
}
