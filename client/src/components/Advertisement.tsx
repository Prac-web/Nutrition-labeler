import React, { useEffect } from 'react';

const Advertisement = ({ html }) => {
  useEffect(() => {
    // Execute all scripts manually
    const container = document.getElementById('html-container');
    const scripts = container.querySelectorAll('script');

    scripts.forEach((script) => {
      const newScript = document.createElement('script');
      // Copy all attributes
      for (let i = 0; i < script.attributes.length; i++) {
        const attr = script.attributes[i];
        newScript.setAttribute(attr.name, attr.value);
      }
      // Copy inline script content
      newScript.textContent = script.textContent;
      // Replace old script
      script.parentNode.replaceChild(newScript, script);
    });
  }, [html]);

  return (
    <div
      id="html-container"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Advertisement;