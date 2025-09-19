export interface ModelMinimumSchema {
  creationTimeStamp: string;
  createdBy: string;
  modifiedTimeStamp: string;
  modifiedBy: string;
  id: string;
  name: string;
  description: string;
  scoreCodeType: string;
  algorithm: string;
  function: string;
  modeler: string;
  modelType: string;
  trainCodeType: string;
  targetLevel: string;
  tool: string;
  toolVersion: string;
  externalUrl: string;
  modelVersionName: string;
  ["custom properties"]: Array<{
    name: string;
    value: string;
    type: string;
  }>;
}