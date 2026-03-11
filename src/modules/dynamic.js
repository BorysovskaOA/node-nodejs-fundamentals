import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const dynamic = async () => {
  // Write your code here
  // Accept plugin name as CLI argument
  // Dynamically import plugin from plugins/ directory
  // Call run() function and print result
  // Handle missing plugin case

  const pluginName = process.argv[2];

  if (!pluginName) {
    console.error('Please provide a plugin name');
    return;
  }

  const pluginPath = path.join(process.cwd(), 'src/modules/plugins', `${pluginName}.js`);

  try {
    const pluginUrl = pathToFileURL(pluginPath).href;

    const plugin = await import(pluginUrl);

    if (typeof plugin.run === 'function') {
      const result = await plugin.run();
      console.log(result);
    } else {
      console.error(`Plugin "${pluginName}" does not export a run() function`);
    }
  } catch (err) {
    console.error(`Plugin "${pluginName}" not found at ${pluginPath}`);
  }
};

await dynamic();
