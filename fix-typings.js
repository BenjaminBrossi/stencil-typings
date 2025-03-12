const fs = require('fs');
const path = require('path');

function camelToKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function kebabToCamelCase(str) {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function processComponentsTypings() {
  console.log('Starting typings fix...');

  const componentsFilePath = path.join(
    process.cwd(),
    'dist/types/components.d.ts'
  );

  if (!fs.existsSync(componentsFilePath)) {
    console.error(`Error: File not found: ${componentsFilePath}`);
    process.exit(1);
  }

  try {
    const originalContent = fs.readFileSync(componentsFilePath, 'utf8');

    // Extract component properties
    const properties = extractProperties(originalContent);
    console.log(`Found ${properties.size} unique properties`);

    // Generate React module declaration
    const reactModule = createReactModuleDeclaration(properties);

    // Append to the file
    fs.writeFileSync(
      componentsFilePath,
      originalContent + '\n\n' + reactModule,
      'utf8'
    );

    console.log('Successfully added kebab-case attributes to typings');
  } catch (error) {
    console.error('Error processing components.d.ts:', error.message);
    process.exit(1);
  }
}

function extractProperties(content) {
  const propertyMap = new Map();

  // Simple regex to extract properties from Components namespace
  const componentRegex = /interface\s+(\w+)\s+{([^}]+)}/g;
  const propertyRegex = /"([^"]+)"\s*:?\s*([^;]+);/g;

  let componentMatch;
  while ((componentMatch = componentRegex.exec(content)) !== null) {
    const componentBody = componentMatch[2];

    let propertyMatch;
    while ((propertyMatch = propertyRegex.exec(componentBody)) !== null) {
      const name = propertyMatch[1];
      const type = propertyMatch[2].trim();

      // Skip event handlers and special properties
      if (
        name === 'onEvent' ||
        (name.startsWith('on') && name.length > 2 && /^on[A-Z]/.test(name)) ||
        name === 'ref' ||
        name === 'key'
      ) {
        continue;
      }

      // Get kebab-case version of the property name
      const kebabName = camelToKebabCase(name);

      if (!propertyMap.has(kebabName)) {
        propertyMap.set(kebabName, {
          kebabName,
          camelName: name,
          type,
        });
      }
    }
  }

  return propertyMap;
}

function createReactModuleDeclaration(propertyMap) {
  let module = '// Added by fix-typings.js to support kebab-case attributes\n';
  module += 'declare module "react" {\n';
  module += '  export namespace JSX {\n';
  module += '    interface IntrinsicElements {\n';
  module += '      "my-component": {\n';

  // Add kebab-case properties
  for (const [kebabName, prop] of propertyMap.entries()) {
    if (kebabName !== prop.camelName) {
      module += `        "${kebabName}"?: ${prop.type};\n`;
    }
  }

  module += '      } & LocalJSX.MyComponent;\n';
  module += '    }\n';
  module += '  }\n';
  module += '}\n';

  return module;
}

processComponentsTypings();
