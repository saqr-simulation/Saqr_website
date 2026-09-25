# Agricultural Drone Spraying & Drift Mitigation Manual
**Document ID:** doc-spraying-manual  
**Target Platform:** SAQR Professional Drone Academy  
**Classification:** Standard Operating Procedures & Field Training Guidance  
**Course:** Agricultural Drone Operations (`agricultural-drone-operations`)

---

## 1. Overview and Operational Scope

Agricultural unmanned aerial application systems (spray drones) represent a critical technological advancement in precision crop protection. When operated correctly, multi-rotor spray platforms deliver targeted applications of liquid crop treatments, micronutrients, and biological agents with superior efficacy compared to conventional tractor boom sprayers.

### 1.1 The Pilot in Command Responsibility
The Remote Pilot in Command (RPIC) maintains sole responsibility for:
- Ensuring the airframe and payload system are airworthy before flight.
- Evaluating local microclimate and terrain conditions.
- Selecting appropriate nozzle configurations and operating altitudes.
- Maintaining active environmental buffer zones to prevent unintended off-target drift.
- Complying with civil aviation regulations and manufacturer operational limits.

### 1.2 General Training Notice
This manual provides best-practice training guidance for multirotor agricultural UAVs (nominal payload capacities of 10L to 50L). Flight crews must always cross-reference specific chemical product labels, pesticide safety data sheets (MSDS), and civil aviation airspace requirements for their operating jurisdiction.

---

## 2. Pre-Flight Preparation and Safety Checklist

A structured pre-flight routine minimizes equipment failures and ensures mission repeatability. Every spraying sortie must follow this sequence prior to chemical loading.

### 2.1 Airframe and Propulsion Inspection
1. **Structural Arms and Clamps**: Inspect carbon-fiber arms for hairline stress fractures, loose motor mount fasteners, or fatigued arm-folding latches.
2. **Propeller Assemblies**: Tactilely inspect leading and trailing edges of folding propellers. Discard any blade exhibiting nicks, scratches exceeding 1mm, delamination, or abnormal pivot friction.
3. **Brushless Motors**: Spin each motor by hand. Verify smooth rotation without grinding, bearing play, or magnetic rotor detent resistance. Inspect cooling vents for dust or chemical residue.
4. **Power System & LiPo Batteries**: Check smart flight battery terminals for carbonization. Verify battery cell voltage delta is less than 0.03V under resting conditions. Batteries with swollen casings or abnormal internal resistance must be quarantined immediately.

### 2.2 Spraying System Verification
1. **Liquid Tank and Filter Mesh**: Inspect tank strainer and inline fluid filters for particulate clogging or biological buildup. Flush with clean water.
2. **Peristaltic & Diaphragm Pumps**: Perform a 15-second pump purge cycle using clean water to eliminate trapped air pockets in supply lines.
3. **Nozzle Calibrations**: Check atomizing centrifugal discs or hydraulic flat-fan nozzles for uniform spray patterns. Verify flow rate output matches calibrated mission software parameters (target flow rate in Liters per minute).
4. **Leak Test**: Pressurize the liquid circuit to operating pressure for 30 seconds; confirm zero weeping or dripping at hose junctions and solenoid valves.

### 2.3 Avionics and Failsafe Setup
1. **GNSS & RTK Lock**: Confirm satellite constellation acquisition with dual-antenna heading lock. Require RTK FIX status (minimum 16 satellites) for centimeter-level flight line accuracy.
2. **Obstacle Sensing**: Clean forward, backward, and downward millimeter-wave phased-array radar lenses and binocular vision sensors.
3. **Failsafe Return-to-Home (RTH)**: Set the automated RTH altitude at least 15 meters above the tallest canopy obstacle or electrical transmission pylon in the operational boundary.

---

## 3. Weather and Meteorological Considerations

Atmospheric parameters dictate droplet evaporation rates, aerodynamic dispersion, and spray drift risks. Remote pilots must gather real-time microclimate metrics directly at the field boundary prior to and during operations.

### 3.1 Wind Speed Thresholds
- **Ideal Operating Range**: 1.5 m/s to 4.0 m/s (3 to 8 knots). A gentle breeze assists downward droplet deposition without causing excessive lateral drift.
- **Marginal Conditions**: 4.0 m/s to 6.0 m/s (8 to 12 knots). Requires increasing droplet volume median diameter (VMD), lowering flight altitude, and expanding downwind buffer zones.
- **Prohibited Conditions**: Sustained wind exceeding 6.0 m/s (>12 knots) or wind gusts exceeding 7.5 m/s. All agricultural spraying operations must cease immediately due to extreme risk of off-target drift.

### 3.2 Temperature and Relative Humidity
- **High Temperature Caution**: Do not conduct fine or medium spray operations when ambient temperatures exceed 30°C (86°F). Elevated ambient heat accelerates droplet water evaporation, converting spray into microscopic airborne aerosol particles that drift for kilometers.
- **Relative Humidity (RH)**: Operations should be conducted when relative humidity is above 50%. When RH drops below 40%, fine droplets evaporate before reaching the target canopy foliage.
- **Delta T Guidelines**: Maintain operations within a Delta T window of 2°C to 8°C. A Delta T above 10°C indicates high evaporation potential and volatile spray conditions.

### 3.3 Atmospheric Temperature Inversions
Never spray during a surface temperature inversion (typically occurring in calm dawn or dusk conditions when warm air traps cooler air near the surface). Under inversion conditions, small suspended droplets can remain trapped in stable air layers and drift unpredictably across several kilometers with minimal wind.

---

## 4. Spray Dynamics, Droplet Sizing, and Drift Mitigation

Off-target spray drift leads to environmental contamination, non-target crop damage, and financial liability. Understanding droplet fluid dynamics is essential for precision pilots.

### 4.1 Droplet Classification Spectrum
Droplet sizes are quantified by Volume Median Diameter (VMD) measured in micrometers (microns, µm):
- **Very Fine (< 100 µm)**: High drift risk; prone to atmospheric suspension and rapid evaporation. Not recommended for drone application.
- **Fine (100–175 µm)**: High foliage coverage; acceptable only in still, high-humidity greenhouse environments.
- **Medium (175–250 µm)**: Good compromise for insecticides and foliar fungicides in low-wind conditions (< 3 m/s).
- **Coarse (250–375 µm)**: Standard baseline for agricultural drone herbicides and field crop spraying. High drift resistance.
- **Very Coarse (> 375 µm)**: Maximum drift reduction; recommended when working adjacent to sensitive ecological zones or organic crops.

### 4.2 Key Strategies for Drift Mitigation
1. **Increase Droplet VMD**: Adjust atomizing centrifugal disk rotation speed downward (e.g., reduce disc speed from 8,000 RPM to 3,500 RPM) or switch to air-induction venturi nozzles to produce coarse droplets (> 250 µm).
2. **Utilize Rotor Downwash**: Multi-rotor aircraft create powerful downward thrust that propels droplets deep into crop canopies. Keep flight speed moderate (4.0–6.5 m/s) to ensure the downwash column remains cohesive rather than trailing behind the aircraft.
3. **Anti-Drift Adjuvants**: Utilize certified polymer-based drift-reduction agents in the spray tank mix to suppress the creation of satellite droplets under 105 microns.
4. **Maintain Environmental Buffer Distances**: Establish a minimum standoff buffer of 50 meters downwind from watercourses, apiaries, livestock enclosures, and residential settlements.

---

## 5. Flight Altitude, Swath Width, and Application Parameters

Flight velocity and altitude determine swath uniformity and chemical deposition quality.

### 5.1 Flight Altitude Above Crop Canopy
- **Recommended Operating Height**: 1.5 meters to 3.0 meters directly above the upper crop canopy.
- **Low Altitude Risks (< 1.5 m)**: Extreme rotor downwash can cause severe plant lodging, crop damage, uneven swath overlap, and ground obstacle collision.
- **High Altitude Risks (> 3.5 m)**: Rotor downwash dissipates before striking the crop, allowing ambient crosswinds to scatter droplets and cause severe lateral drift.
- **Terrain-Following Radar**: Always enable real-time terrain-following millimeter radar when working rolling or terraced orchards to maintain constant canopy clearance.

### 5.2 Swath Width and Overlap
- **Calibrated Swath Width**: Set flight line spacing to match 80% of effective spray width (typically 4.0m to 6.5m depending on boom configuration) to ensure adequate 20% overlap between adjacent flight swaths.
- **Flight Speed**: Maintain a steady ground speed between 3.5 m/s and 6.0 m/s. Accelerating beyond 7 m/s strips the spray droplets from the rotor downwash envelope.

---

## 6. Safety Procedures and Operational Buffer Zones

Safety of uninvolved personnel, ground crew, and livestock takes precedence over all agricultural deliverables.

### 6.1 Personal Protective Equipment (PPE)
Ground handlers and pilots must wear appropriate PPE during chemical loading and flight monitoring:
- Chemical-resistant nitrile gloves (minimum 15 mil thickness).
- EN166 certified splash goggles or full-face shield.
- Type 4/5/6 protective hooded coveralls.
- Half-mask respirator with organic vapor and particulate filter cartridges (A1P2 or A2P3 rating).

### 6.2 Ground Crew Staging and VLOS
- **Pilot Stationing**: Position the pilot control station upwind from the treatment zone, at a minimum distance of 15 meters from active spray swaths.
- **Visual Line of Sight (VLOS)**: The RPIC and designated Visual Observer (VO) must maintain continuous, unassisted visual contact with the aircraft throughout the flight sortie.
- **Bystander Buffer**: Establish a 30-meter exclusion zone around the takeoff, landing, and chemical staging area. Never arm or fly an aircraft over people.

---

## 7. Emergency Procedures and Safety Abort Protocols

When equipment or meteorological anomalies occur, rapid execution of rehearsed emergency protocols mitigates hazards.

### 7.1 Immediate Mission Abort Conditions
When operational flight conditions become unsafe or hazardous anomalies manifest, the Remote Pilot must trigger an immediate operational abort upon observing any of the following:
- Incursion of unnotified aircraft or low-flying agricultural crop dusters into the operating airspace.
- Sudden rise in wind velocity exceeding 6.0 m/s or strong localized dust devils.
- Intrusion of farm personnel or bystanders into the spray buffer boundary.
- Flight telemetry signal drop (RSSI < 30%) or loss of RTK satellite fix.
- Battery cell voltage dropping below 3.4V per cell under operational load.

### 7.2 Chemical Leak or Boom Rupture in Flight
1. Immediately disengage spray pump and close liquid shutoff solenoid valves.
2. Direct the aircraft to the nearest designated unplanted buffer zone or containment ditch.
3. Land the aircraft smoothly and disarm the motors.
4. Approach upwind with PPE equipped and apply neutralizing absorbent material to any spill on the ground.

### 7.3 Uncontrolled Drift or Motor Propulsion Failure
- **Hexacopter Motor Degradation**: Maintain level attitude, cancel automated route, and guide the aircraft toward the nearest clear landing area using manual attitude mode.
- **Flyaway Scenario**: Instantly switch flight mode switch from Autonomous GPS to Manual/Attitude mode. If telemetry control is unresponsive and the aircraft moves toward people or public roads, activate the physical Emergency Motor Stop command over an unoccupied sector.
- **LiPo Fire Hazard**: If a battery ruptures or catches fire after an impact, maintain a 15-meter standoff distance. Do not inhale toxic fluoride fumes. Extinguish only with dry powder Class D extinguishers or dry sand; do not use water.

---

## 8. Operational Flight Checklist Summary

### Pre-Mission Phase:
- [ ] Airspace authorized and local NOTAMs reviewed.
- [ ] SORA risk assessment conducted; emergency ditch zones identified.
- [ ] On-site wind speed confirmed ≤ 6.0 m/s; temperature < 30°C; Delta T 2–8°C.
- [ ] Ground crew briefed on emergency abort commands and buffer boundaries.

### Pre-Flight Airframe & Spraying Check:
- [ ] Structural arms, latches, and folding props inspected for damage.
- [ ] Battery seated firmly; cell delta < 0.03V; contacts clean.
- [ ] Water flush completed; spray nozzles calibrated for uniform coarse droplet VMD (> 250 µm).
- [ ] RTK FIX confirmed; RTH altitude verified at 15m above highest local obstacle.

### In-Flight Phase:
- [ ] Altitude held between 1.5m and 3.0m above canopy.
- [ ] Flight speed steady between 4.0 m/s and 6.0 m/s for optimal rotor downwash.
- [ ] Continuous VLOS maintained by RPIC and Visual Observer.

### Post-Mission Phase:
- [ ] Liquid tank and boom rinsed three times with clean water.
- [ ] Batteries discharged to storage voltage (3.80V–3.85V per cell).
- [ ] Flight hours, chemical volume applied, and meteorological readings logged in flight records.
