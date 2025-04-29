``` mermaid
    sequenceDiagram
    participant Browser
    participant Main
    participant Governors
    participant ColonyInventories
    participant Facilities
    participant FacilityMinerals
    participant SpaceCart
    participant PurchaseMineralButton
    participant API
    participant TransientState

    Browser->>Main: Load page (initial render)

    Main->>Governors: Request Governors dropdown HTML
    Governors->>API: Fetch governors
    API-->>Governors: Return governors data

    activate Governors
    Governors->>Governors: Filter active governors
    loop activeGovernors.map()
        Governors->>Governors: Build <option> HTML
    end
    Governors-->>Main: Return completed HTML
    Main-->>Browser: Render Governors dropdown

    Browser->>Facilities: Request Facilities dropdown HTML
    Facilities->>API: Fetch facilities
    API-->>Facilities: Return facilities data
    Facilities->>API: Fetch governors
    API-->>Facilities: Return governors data

    Facilities->>Facilities: Find selected governor
    alt selectedGovernor exists and active
        Facilities->>Facilities: Enable facilities dropdown
    else
        Facilities->>Facilities: Disable facilities dropdown
    end
    loop facilities.map()
        Facilities->>Facilities: Build <option> HTML
    end
    Facilities-->>Browser: Return completed HTML

    Browser->>FacilityMinerals: Run buildFacilityMineralsHTML (initial load)

    FacilityMinerals->>TransientState: getTransientState()
    TransientState-->>FacilityMinerals: Return state

    alt facilityId != 0
        FacilityMinerals->>API: Fetch facilityMinerals
        API-->>FacilityMinerals: Return facilityMinerals

        FacilityMinerals->>FacilityMinerals: Filter by facilityId
        alt minerals found
            alt all minerals out of stock
                FacilityMinerals->>FacilityMinerals: Build "out of stock" HTML
            else
                alt facility active
                    loop minerals.map()
                        FacilityMinerals->>FacilityMinerals: Build HTML (radio buttons)
                    end
                else
                    FacilityMinerals->>FacilityMinerals: Build "inactive" HTML
                end
            end
        else
            FacilityMinerals->>FacilityMinerals: Build "no minerals" HTML
        end
    else
        FacilityMinerals->>FacilityMinerals: Build empty minerals HTML
    end
    FacilityMinerals->>Browser: Dispatch reRender

    Browser->>SpaceCart: Run buildSpaceCartHTML (initial load)
    SpaceCart->>TransientState: getTransientState()
    TransientState-->>SpaceCart: Return state

    alt selectedMineral exists
        SpaceCart->>API: Fetch facilityMinerals
        API-->>SpaceCart: Return facilityMinerals

        SpaceCart->>SpaceCart: Find selected mineral
        alt facility active
            SpaceCart->>PurchaseMineralButton: Generate active button HTML
        else
            SpaceCart->>PurchaseMineralButton: Generate inactive button HTML
        end
    else
        SpaceCart->>PurchaseMineralButton: Generate inactive button HTML
    end
    SpaceCart->>Browser: Dispatch reRender

    Browser->>Browser: User selects a Governor

    Browser->>TransientState: setGovernor
    TransientState->>Browser: Dispatch "stateChanged"

    Browser->>ColonyInventories: "stateChanged" event handler
    ColonyInventories->>TransientState: getTransientState()
    TransientState-->>ColonyInventories: Return state

    alt governorId != 0
        ColonyInventories->>API: Fetch governors
        API-->>ColonyInventories: Return governors

        ColonyInventories->>API: Fetch colonyInventories
        API-->>ColonyInventories: Return colony inventories

        alt selectedGovernor found
            ColonyInventories->>ColonyInventories: Filter colony inventories
            loop colonyInventory.map()
                ColonyInventories->>ColonyInventories: Build inventory HTML
            end
        else
            ColonyInventories->>ColonyInventories: Build empty inventory
        end
    else
        ColonyInventories->>ColonyInventories: Build empty inventory
    end
    ColonyInventories->>Browser: Dispatch reRender

    %% Repeat steps for Facilities
    Browser->>Facilities: Request Facilities dropdown HTML (again after stateChanged)
    %% Same steps for Facilities...
    
    %% Repeat steps for FacilityMinerals
    Browser->>FacilityMinerals: buildFacilityMineralsHTML
    %% Same steps for FacilityMinerals...

    %% Repeat steps for SpaceCart
    Browser->>SpaceCart: buildSpaceCartHTML
    %% Same steps for SpaceCart...

    Browser->>PurchaseMineralButton: User clicks "Purchase" button

    PurchaseMineralButton->>TransientState: purchaseMineral()
    
    %% Get selected state
    TransientState->>TransientState: getTransientState()

    %% Fetch governors
    TransientState->>API: GET /governors
    API-->>TransientState: Return governors
    TransientState->>TransientState: Find selected governor

    %% Fetch colonyInventories
    TransientState->>API: GET /colonyInventories?_expand=mineral
    API-->>TransientState: Return colony inventories
    TransientState->>TransientState: Filter for matching colony and mineral

    %% Fetch facilityMinerals
    TransientState->>API: GET /facilityMinerals
    API-->>TransientState: Return facility mineral inventory
    TransientState->>TransientState: Filter for matching facility and mineral

    alt facilityMineral exists and quantity > 0
        alt colonyMineral exists
            %% Update existing colony inventory
            TransientState->>API: PUT /colonyInventories/:id
            API-->>TransientState: Confirm inventory update
        else
            %% Create new colony inventory entry
            TransientState->>API: POST /colonyInventories
            API-->>TransientState: Confirm new entry
        end

        %% Decrement facility inventory
        TransientState->>API: PUT /facilityMinerals/:id (quantity -1)
        API-->>TransientState: Confirm facility update

        %% Trigger re-render
        TransientState->>Browser: Dispatch "stateChanged"
    else
        %% No purchase made, out of stock
    end