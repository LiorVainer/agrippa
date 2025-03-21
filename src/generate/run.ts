import { Logger } from '../logger';
import { panic } from '../utils/panic';

import { Config } from './Config';
import { generateFiles } from './generateFiles';
import { generateReactCode } from './generateReactCode';
import { runPostCommand } from './runPostCommand';


export async function run(config: Config, logger: Logger) {
  const componentCode = generateReactCode(config);
  try {
    const generatedPaths = await generateFiles(config, componentCode, logger);

    logger.info(
      'Generation successful.',
      'Generated files:',
      ...Object.values(generatedPaths)
    );

    const variablePaths = {
      '<componentPath>': generatedPaths.component,
      '<stylesPath>': generatedPaths.styles,
      '<dirPath>': generatedPaths.dir
    };
    await runPostCommand(variablePaths, config, logger);
  }
  catch (e) {
    panic(e);
  }
}