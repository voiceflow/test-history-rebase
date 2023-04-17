import { AlexaProject } from '@voiceflow/alexa-types';

import { AbstractControl } from '../control';

class ProductService extends AbstractControl {
  public async getAll(creatorID: number, projectID: string): Promise<AlexaProject.Product[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    const project = await client.project.get<AlexaProject.PlatformData, AlexaProject.MemberPlatformData>(projectID);

    return Object.values(project.platformData.products);
  }

  public async get(creatorID: number, projectID: string, productID: string): Promise<AlexaProject.Product> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    const project = await client.project.get<AlexaProject.PlatformData, AlexaProject.MemberPlatformData>(projectID);
    const product = project.platformData.products[productID];

    if (!product) throw new Error(`no product found by ID: ${productID}`);

    return product;
  }

  public async create(creatorID: number, projectID: string, product: AlexaProject.Product): Promise<AlexaProject.Product> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.product.create(projectID, product);
  }

  public async update(creatorID: number, projectID: string, productID: string, product: AlexaProject.Product): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.product.update(projectID, productID, { ...product, productID });
  }

  public async delete(creatorID: number, projectID: string, productID: string): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.product.delete(projectID, productID);
  }
}

export default ProductService;
