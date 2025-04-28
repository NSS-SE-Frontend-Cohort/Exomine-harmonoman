``` mermaid
graph TD;
    A[Main Module] --> B[GovernorsDropdown Module];
    A --> C[DisplayFacilities Module];
    A --> D[DisplayFacilityMinerals Module];
    A --> E[DisplaySpaceCart Module];

    B --> F[TransientState Module];
    B --> G[API Module];

    C --> F[TransientState Module];
    C --> G[API Module];

    D --> F[TransientState Module];
    D --> G[API Module];

    E --> F[TransientState Module];
    E --> G[API Module];
    E --> H[PurchaseMineralButton Module];

    H --> F[TransientState Module];