// Inspired by https://github.com/nikeee/poor-mans-react/blob/35cdae48b29ed82a58a4ae69b497f353b608dc26/src/poor-mans-react.ts
const createElement = (tag, props) => {
  if (typeof tag === "function") {
    return tag(props);
  }

  const element = {
    tag,
    props,
  };

  return element;
};

const render = (vdomElem, container) => {
  if (Array.isArray(vdomElem)) {
    vdomElem.map((elem) => render(elem, container));
    return;
  }
  switch (typeof vdomElem) {
    case "boolean":
      return;
    case "string":
    case "number":
      const textNode = document.createTextNode(String(vdomElem));
      container.appendChild(textNode);
      return;
    default:
      const { tag, props } = vdomElem;
      const domNode = document.createElement(tag);

      for (const [prop, value] of Object.entries(props)) {
        if (prop !== "children") {
          domNode[prop] = value;
        }
      }

      if (Array.isArray(props.children)) {
        props.children.map((child) => render(child, domNode));
      } else {
        render(props.children, domNode);
      }

      container.appendChild(domNode);
  }
};

module.exports = {
  render,
  jsx: createElement,
  jsxs: createElement,
};
