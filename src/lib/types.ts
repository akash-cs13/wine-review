export type myjson = {
    label: string;
    value: string;
}

export type context = {
    variety: string;
    provience: string;
    country: string;
  };

export type generatedMessage = {
    context: context;
    input: string | null;
    isGenerated: boolean;
    generated: string;
}

export type messages = generatedMessage[]