import type { Sighting } from '../../domain/sightings';
import { SightingsRepository } from '../../repositories/SightingsRepository';
import { deleteOwnedPhoto } from '../photoService';
import { deleteSighting } from '../sightingService';

jest.mock('../../repositories/SightingsRepository');
jest.mock('../photoService');

const repositoryMock = SightingsRepository as jest.MockedClass<typeof SightingsRepository>;
const deleteOwnedPhotoMock = deleteOwnedPhoto as jest.MockedFunction<typeof deleteOwnedPhoto>;

const sighting = {
  id: 'sighting-1',
  birdName: 'Chucao',
  photoUri: 'file:///documents/sightings/photos/photo-one.jpg',
} as Pick<Sighting, 'id' | 'birdName' | 'photoUri'>;

describe('deleteSighting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deletes the record before cleaning its owned photo', async () => {
    const findById = jest.fn().mockResolvedValue(sighting);
    const deleteById = jest.fn().mockResolvedValue(true);
    repositoryMock.mockImplementation(() => ({ findById, deleteById } as never));

    await expect(deleteSighting(' sighting-1 ')).resolves.toBe(true);
    expect(deleteById).toHaveBeenCalledWith('sighting-1');
    expect(deleteOwnedPhotoMock).toHaveBeenCalledWith(sighting.photoUri);
  });

  it('does not claim deletion when persistence fails', async () => {
    const findById = jest.fn().mockRejectedValue(new Error('database unavailable'));
    repositoryMock.mockImplementation(() => ({ findById } as never));

    await expect(deleteSighting('sighting-1')).rejects.toThrow('database unavailable');
    expect(deleteOwnedPhotoMock).not.toHaveBeenCalled();
  });
});
