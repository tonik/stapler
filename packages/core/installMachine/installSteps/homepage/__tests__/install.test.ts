import { describe, it, expect, vi } from 'vitest';
import { homepageFiles } from '../../../../templates/homepage/installConfig';
import { templateGenerator } from '../../../../utils/generator/generator';
import { getTemplateDirectory } from '../../../../utils/getTemplateDirectory';
import { modifyHomepage } from '../install';

// Mock dependencies
vi.mock('../../../../utils/generator/generator');
vi.mock('../../../../utils/getTemplateDirectory');
vi.mock('../../../../utils/logger', () => ({
  logger: {
    withSpinner: vi.fn((_, __, callback) => callback({ succeed: vi.fn(), fail: vi.fn() })),
  },
}));

describe('modifyHomepage', () => {
  it('should correctly set up homepage files', async () => {
    // Arrange
    const destinationDirectory = '/mock/destination';
    const mockTemplateDirectory = '/mock/template/directory';

    // Mock getTemplateDirectory to return a specific path
    vi.mocked(getTemplateDirectory).mockReturnValue(mockTemplateDirectory);

    // Act
    await modifyHomepage(destinationDirectory);

    // Assert
    expect(getTemplateDirectory).toHaveBeenCalledWith('/templates/homepage/files/');
    expect(templateGenerator).toHaveBeenCalledWith(homepageFiles, mockTemplateDirectory, destinationDirectory);
  });
});
