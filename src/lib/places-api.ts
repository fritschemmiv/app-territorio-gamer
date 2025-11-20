export interface PlaceSuggestion {
  queryPrediction: {
    text: {
      text: string;
      matches: Array<{
        endOffset: number;
      }>;
    };
    structuredFormat: {
      mainText: {
        text: string;
        matches: Array<{
          endOffset: number;
        }>;
      };
    };
  };
}

export interface PlacesResponse {
  suggestions: PlaceSuggestion[];
}

export async function searchPlaces(input: string): Promise<PlacesResponse> {
  const url = 'https://google-map-places-new-v2.p.rapidapi.com/v1/places:autocomplete';

  const data = {
    input,
    locationBias: {
      circle: {
        center: {
          latitude: 40,
          longitude: -110
        },
        radius: 10000
      }
    },
    includedPrimaryTypes: [],
    includedRegionCodes: [],
    languageCode: '',
    regionCode: '',
    origin: {
      latitude: 0,
      longitude: 0
    },
    inputOffset: 0,
    includeQueryPredictions: true,
    sessionToken: ''
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-FieldMask': '*',
      'x-rapidapi-host': 'google-map-places-new-v2.p.rapidapi.com',
      'x-rapidapi-key': '510795793fmsh92317a67068346ap1158f8jsn116bd88a6c77'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}