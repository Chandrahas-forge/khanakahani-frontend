# RecipesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addRecipeNoteRecipesRecipeIdNotesPost**](#addrecipenoterecipesrecipeidnotespost) | **POST** /recipes/{recipe_id}/notes | Add Recipe Note|
|[**createNewRecipeRecipesPost**](#createnewreciperecipespost) | **POST** /recipes/ | Create New Recipe|
|[**listRecipeNotesRecipesRecipeIdNotesGet**](#listrecipenotesrecipesrecipeidnotesget) | **GET** /recipes/{recipe_id}/notes | List Recipe Notes|
|[**listRecipesRecipesGet**](#listrecipesrecipesget) | **GET** /recipes/ | List Recipes|
|[**markFavoriteRecipesRecipeIdFavoritePost**](#markfavoriterecipesrecipeidfavoritepost) | **POST** /recipes/{recipe_id}/favorite | Mark Favorite|
|[**partialUpdateRecipeRecipesRecipeIdPatch**](#partialupdatereciperecipesrecipeidpatch) | **PATCH** /recipes/{recipe_id} | Partial Update Recipe|
|[**readRecipeRecipesRecipeIdGet**](#readreciperecipesrecipeidget) | **GET** /recipes/{recipe_id} | Read Recipe|
|[**removeFavoriteRecipesRecipeIdFavoriteDelete**](#removefavoriterecipesrecipeidfavoritedelete) | **DELETE** /recipes/{recipe_id}/favorite | Remove Favorite|
|[**removeRecipeRecipesRecipeIdDelete**](#removereciperecipesrecipeiddelete) | **DELETE** /recipes/{recipe_id} | Remove Recipe|
|[**replaceRecipeRecipesRecipeIdPut**](#replacereciperecipesrecipeidput) | **PUT** /recipes/{recipe_id} | Replace Recipe|

# **addRecipeNoteRecipesRecipeIdNotesPost**
> RecipeNoteOut addRecipeNoteRecipesRecipeIdNotesPost(recipeNoteCreate)


### Example

```typescript
import {
    RecipesApi,
    Configuration,
    RecipeNoteCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new RecipesApi(configuration);

let recipeId: number; // (default to undefined)
let recipeNoteCreate: RecipeNoteCreate; //

const { status, data } = await apiInstance.addRecipeNoteRecipesRecipeIdNotesPost(
    recipeId,
    recipeNoteCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **recipeNoteCreate** | **RecipeNoteCreate**|  | |
| **recipeId** | [**number**] |  | defaults to undefined|


### Return type

**RecipeNoteOut**

### Authorization

[OAuth2PasswordBearer](../README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Successful Response |  -  |
|**404** | Not found |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createNewRecipeRecipesPost**
> RecipeOut createNewRecipeRecipesPost(recipeCreate)


### Example

```typescript
import {
    RecipesApi,
    Configuration,
    RecipeCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new RecipesApi(configuration);

let recipeCreate: RecipeCreate; //

const { status, data } = await apiInstance.createNewRecipeRecipesPost(
    recipeCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **recipeCreate** | **RecipeCreate**|  | |


### Return type

**RecipeOut**

### Authorization

[OAuth2PasswordBearer](../README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Successful Response |  -  |
|**404** | Not found |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listRecipeNotesRecipesRecipeIdNotesGet**
> Array<RecipeNoteOut> listRecipeNotesRecipesRecipeIdNotesGet()


### Example

```typescript
import {
    RecipesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RecipesApi(configuration);

let recipeId: number; // (default to undefined)

const { status, data } = await apiInstance.listRecipeNotesRecipesRecipeIdNotesGet(
    recipeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **recipeId** | [**number**] |  | defaults to undefined|


### Return type

**Array<RecipeNoteOut>**

### Authorization

[OAuth2PasswordBearer](../README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**404** | Not found |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listRecipesRecipesGet**
> Array<RecipeOut> listRecipesRecipesGet()


### Example

```typescript
import {
    RecipesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RecipesApi(configuration);

let cuisine: string; // (optional) (default to undefined)
let ingredients: string; // (optional) (default to undefined)
let tags: string; // (optional) (default to undefined)
let page: number; // (optional) (default to 1)
let limit: number; // (optional) (default to 10)

const { status, data } = await apiInstance.listRecipesRecipesGet(
    cuisine,
    ingredients,
    tags,
    page,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **cuisine** | [**string**] |  | (optional) defaults to undefined|
| **ingredients** | [**string**] |  | (optional) defaults to undefined|
| **tags** | [**string**] |  | (optional) defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to 1|
| **limit** | [**number**] |  | (optional) defaults to 10|


### Return type

**Array<RecipeOut>**

### Authorization

[OAuth2PasswordBearer](../README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**404** | Not found |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **markFavoriteRecipesRecipeIdFavoritePost**
> any markFavoriteRecipesRecipeIdFavoritePost()


### Example

```typescript
import {
    RecipesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RecipesApi(configuration);

let recipeId: number; // (default to undefined)

const { status, data } = await apiInstance.markFavoriteRecipesRecipeIdFavoritePost(
    recipeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **recipeId** | [**number**] |  | defaults to undefined|


### Return type

**any**

### Authorization

[OAuth2PasswordBearer](../README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**404** | Not found |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **partialUpdateRecipeRecipesRecipeIdPatch**
> RecipeOut partialUpdateRecipeRecipesRecipeIdPatch(requestBody)


### Example

```typescript
import {
    RecipesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RecipesApi(configuration);

let recipeId: number; // (default to undefined)
let requestBody: { [key: string]: any; }; //

const { status, data } = await apiInstance.partialUpdateRecipeRecipesRecipeIdPatch(
    recipeId,
    requestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **{ [key: string]: any; }**|  | |
| **recipeId** | [**number**] |  | defaults to undefined|


### Return type

**RecipeOut**

### Authorization

[OAuth2PasswordBearer](../README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**404** | Not found |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **readRecipeRecipesRecipeIdGet**
> RecipeOut readRecipeRecipesRecipeIdGet()


### Example

```typescript
import {
    RecipesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RecipesApi(configuration);

let recipeId: number; // (default to undefined)

const { status, data } = await apiInstance.readRecipeRecipesRecipeIdGet(
    recipeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **recipeId** | [**number**] |  | defaults to undefined|


### Return type

**RecipeOut**

### Authorization

[OAuth2PasswordBearer](../README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**404** | Not found |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **removeFavoriteRecipesRecipeIdFavoriteDelete**
> any removeFavoriteRecipesRecipeIdFavoriteDelete()


### Example

```typescript
import {
    RecipesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RecipesApi(configuration);

let recipeId: number; // (default to undefined)

const { status, data } = await apiInstance.removeFavoriteRecipesRecipeIdFavoriteDelete(
    recipeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **recipeId** | [**number**] |  | defaults to undefined|


### Return type

**any**

### Authorization

[OAuth2PasswordBearer](../README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**404** | Not found |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **removeRecipeRecipesRecipeIdDelete**
> any removeRecipeRecipesRecipeIdDelete()


### Example

```typescript
import {
    RecipesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RecipesApi(configuration);

let recipeId: number; // (default to undefined)

const { status, data } = await apiInstance.removeRecipeRecipesRecipeIdDelete(
    recipeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **recipeId** | [**number**] |  | defaults to undefined|


### Return type

**any**

### Authorization

[OAuth2PasswordBearer](../README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**404** | Not found |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **replaceRecipeRecipesRecipeIdPut**
> RecipeOut replaceRecipeRecipesRecipeIdPut(recipeCreate)


### Example

```typescript
import {
    RecipesApi,
    Configuration,
    RecipeCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new RecipesApi(configuration);

let recipeId: number; // (default to undefined)
let recipeCreate: RecipeCreate; //

const { status, data } = await apiInstance.replaceRecipeRecipesRecipeIdPut(
    recipeId,
    recipeCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **recipeCreate** | **RecipeCreate**|  | |
| **recipeId** | [**number**] |  | defaults to undefined|


### Return type

**RecipeOut**

### Authorization

[OAuth2PasswordBearer](../README.md#OAuth2PasswordBearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**404** | Not found |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

