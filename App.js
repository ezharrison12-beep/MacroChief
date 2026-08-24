import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const DEFAULT_PROFILE = { name: '', age: '', sex: 'male', height: '', weight: '', activity: 'moderate', goal: 'muscle', rate: '0.5' };
const ACTIVITY = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };

function calculateTargets(profile) {
  const weight = Number(profile.weight) || 0;
  const height = Number(profile.height) || 0;
  const age = Number(profile.age) || 0;
  if (!weight || !height || !age) return { calories: 2600, protein: 180, carbs: 280, fat: 80 };
  const bmr = profile.sex === 'female' ? 10 * weight + 6.25 * height - 5 * age - 161 : 10 * weight + 6.25 * height - 5 * age + 5;
  let calories = Math.round(bmr * (ACTIVITY[profile.activity] || 1.55));
  if (profile.goal === 'muscle') calories += 250;
  if (profile.goal === 'lose') calories -= Math.max(250, Math.round(Number(profile.rate || 0.5) * 500));
  const protein = Math.round(weight * (profile.goal === 'muscle' ? 2.0 : 1.8));
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));
  return { calories: Math.max(calories, 1200), protein, carbs, fat };
}

export default function App() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [onboarded, setOnboarded] = useState(false);
  const [logged, setLogged] = useState({ calories: 1420, protein: 112, carbs: 146, fat: 42 });
  const goals = useMemo(() => calculateTargets(profile), [profile]);
  const remaining = useMemo(() => ({
    calories: Math.max(goals.calories - logged.calories, 0), protein: Math.max(goals.protein - logged.protein, 0),
    carbs: Math.max(goals.carbs - logged.carbs, 0), fat: Math.max(goals.fat - logged.fat, 0),
  }), [goals, logged]);

  if (!onboarded) return <Onboarding profile={profile} setProfile={setProfile} onComplete={() => setOnboarded(true)} />;

  const addMeal = () => setLogged((x) => ({ calories: x.calories + 520, protein: x.protein + 38, carbs: x.carbs + 54, fat: x.fat + 16 }));
  return (
    <SafeAreaView style={styles.safe}><StatusBar style="light" /><ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}><View><Text style={styles.eyebrow}>MACROCHIEF</Text><Text style={styles.title}>Good morning{profile.name ? `, ${profile.name}` : ''}.</Text></View><View style={styles.avatar}><Text style={styles.avatarText}>M</Text></View></View>
      <View style={styles.heroCard}><Text style={styles.cardLabel}>TODAY</Text><Text style={styles.calories}>{logged.calories.toLocaleString()}</Text><Text style={styles.muted}>of {goals.calories.toLocaleString()} calories</Text><View style={styles.progressTrack}><View style={[styles.progressFill,{width:`${Math.min(logged.calories/goals.calories,1)*100}%`}]} /></View><Text style={styles.remaining}>{remaining.calories.toLocaleString()} calories remaining</Text></View>
      <Text style={styles.sectionTitle}>Your macros</Text><View style={styles.macroGrid}><MacroCard label="Protein" value={logged.protein} goal={goals.protein} unit="g" /><MacroCard label="Carbs" value={logged.carbs} goal={goals.carbs} unit="g" /><MacroCard label="Fat" value={logged.fat} goal={goals.fat} unit="g" /></View>
      <Text style={styles.sectionTitle}>Quick actions</Text><View style={styles.actions}><Action title="Log a meal" subtitle="Add food & macros" onPress={addMeal} /><Action title="Build a recipe" subtitle="Use your targets" onPress={() => {}} /><Action title="Track workout" subtitle="Adjust today's target" onPress={() => {}} /></View>
      <View style={styles.insightCard}><Text style={styles.insightTitle}>MacroChief insight</Text><Text style={styles.insightText}>You have {remaining.protein}g of protein left today. A protein-rich meal would help you stay on target.</Text></View>
    </ScrollView></SafeAreaView>
  );
}

function Onboarding({ profile, setProfile, onComplete }) {
  const update = (key, value) => setProfile((p) => ({ ...p, [key]: value }));
  const valid = Number(profile.age) > 0 && Number(profile.height) > 0 && Number(profile.weight) > 0;
  return <SafeAreaView style={styles.safe}><StatusBar style="light" /><ScrollView contentContainerStyle={styles.onboard}>
    <Text style={styles.eyebrow}>WELCOME TO MACROCHIEF</Text><Text style={styles.bigTitle}>Let's build your nutrition plan.</Text><Text style={styles.onboardText}>Tell us a little about yourself. We'll calculate a starting target you can adjust later.</Text>
    <Field label="First name" value={profile.name} onChangeText={(v)=>update('name',v)} placeholder="Your name" />
    <View style={styles.row}><Field label="Age" value={profile.age} onChangeText={(v)=>update('age',v)} placeholder="25" numeric /><Field label="Weight (kg)" value={profile.weight} onChangeText={(v)=>update('weight',v)} placeholder="75" numeric /></View>
    <Field label="Height (cm)" value={profile.height} onChangeText={(v)=>update('height',v)} placeholder="180" numeric />
    <Text style={styles.label}>Sex</Text><View style={styles.choiceRow}><Choice label="Male" active={profile.sex==='male'} onPress={()=>update('sex','male')} /><Choice label="Female" active={profile.sex==='female'} onPress={()=>update('sex','female')} /></View>
    <Text style={styles.label}>Activity level</Text><View style={styles.choiceGrid}>{[['sedentary','Sedentary'],['light','Light'],['moderate','Moderate'],['active','Active'],['veryActive','Very active']].map(([k,l])=><Choice key={k} label={l} active={profile.activity===k} onPress={()=>update('activity',k)} />)}</View>
    <Text style={styles.label}>Your goal</Text><View style={styles.choiceGrid}><Choice label="Build muscle" active={profile.goal==='muscle'} onPress={()=>update('goal','muscle')} /><Choice label="Maintain" active={profile.goal==='maintain'} onPress={()=>update('goal','maintain')} /><Choice label="Lose weight" active={profile.goal==='lose'} onPress={()=>update('goal','lose')} /></View>
    {profile.goal==='lose' && <Field label="Desired loss (kg/week)" value={profile.rate} onChangeText={(v)=>update('rate',v)} placeholder="0.5" numeric />}
    <Pressable disabled={!valid} onPress={onComplete} style={[styles.primaryButton,!valid&&styles.disabled]}><Text style={styles.primaryText}>Calculate my targets</Text></Pressable>
    <Text style={styles.disclaimer}>Starting targets are estimates, not medical advice. Adjust based on your progress and professional guidance when appropriate.</Text>
  </ScrollView></SafeAreaView>;
}
function Field({label,value,onChangeText,placeholder,numeric}) { return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#5D6978" keyboardType={numeric?'decimal-pad':'default'} style={styles.input}/></View>; }
function Choice({label,active,onPress}) { return <Pressable onPress={onPress} style={[styles.choice,active&&styles.choiceActive]}><Text style={[styles.choiceText,active&&styles.choiceTextActive]}>{label}</Text></Pressable>; }
function MacroCard({label,value,goal,unit}) { const pct=Math.min(value/goal,1); return <View style={styles.macroCard}><Text style={styles.macroLabel}>{label}</Text><Text style={styles.macroValue}>{value}{unit}</Text><Text style={styles.macroGoal}>of {goal}{unit}</Text><View style={styles.smallTrack}><View style={[styles.smallFill,{width:`${pct*100}%`}]} /></View></View>; }
function Action({title,subtitle,onPress}) { return <Pressable style={({pressed})=>[styles.action,pressed&&styles.pressed]} onPress={onPress}><View><Text style={styles.actionTitle}>{title}</Text><Text style={styles.actionSubtitle}>{subtitle}</Text></View><Text style={styles.arrow}>›</Text></Pressable>; }

const styles=StyleSheet.create({safe:{flex:1,backgroundColor:'#0B0F14'},container:{padding:22,paddingBottom:48},onboard:{padding:22,paddingBottom:50},header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:28},eyebrow:{color:'#7EE787',fontSize:12,fontWeight:'800',letterSpacing:2},title:{color:'#F5F7FA',fontSize:25,fontWeight:'800',marginTop:7},bigTitle:{color:'#F5F7FA',fontSize:34,fontWeight:'900',lineHeight:40,marginTop:12},onboardText:{color:'#8A97A8',fontSize:15,lineHeight:22,marginTop:12,marginBottom:24},avatar:{width:44,height:44,borderRadius:22,backgroundColor:'#17202B',justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'#273444'},avatarText:{color:'#7EE787',fontWeight:'800',fontSize:18},heroCard:{backgroundColor:'#121923',borderRadius:24,padding:24,borderWidth:1,borderColor:'#202C3A'},cardLabel:{color:'#8A97A8',fontSize:12,fontWeight:'800',letterSpacing:1.5},calories:{color:'#FFF',fontSize:48,fontWeight:'900',marginTop:8},muted:{color:'#8A97A8',fontSize:14},progressTrack:{height:10,backgroundColor:'#222D3A',borderRadius:5,marginTop:20,overflow:'hidden'},progressFill:{height:'100%',backgroundColor:'#7EE787',borderRadius:5},remaining:{color:'#C4CDD8',marginTop:12,fontSize:14},sectionTitle:{color:'#F5F7FA',fontSize:19,fontWeight:'800',marginTop:28,marginBottom:14},macroGrid:{flexDirection:'row',gap:10},macroCard:{flex:1,backgroundColor:'#121923',borderRadius:18,padding:15,borderWidth:1,borderColor:'#202C3A'},macroLabel:{color:'#8A97A8',fontSize:12,fontWeight:'700'},macroValue:{color:'#FFF',fontSize:22,fontWeight:'900',marginTop:8},macroGoal:{color:'#667386',fontSize:11,marginTop:2},smallTrack:{height:5,backgroundColor:'#222D3A',borderRadius:3,marginTop:12,overflow:'hidden'},smallFill:{height:'100%',backgroundColor:'#7EE787',borderRadius:3},actions:{gap:10},action:{backgroundColor:'#121923',borderRadius:18,padding:18,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:'#202C3A'},pressed:{opacity:.7},actionTitle:{color:'#FFF',fontSize:16,fontWeight:'800'},actionSubtitle:{color:'#7E8B9B',fontSize:13,marginTop:4},arrow:{color:'#7EE787',fontSize:28},insightCard:{marginTop:20,backgroundColor:'#102019',borderRadius:18,padding:18,borderWidth:1,borderColor:'#1D4430'},insightTitle:{color:'#7EE787',fontSize:14,fontWeight:'800'},insightText:{color:'#C8D5CC',fontSize:14,lineHeight:21,marginTop:8},field:{marginBottom:16},label:{color:'#AEB8C5',fontSize:13,fontWeight:'700',marginBottom:8},input:{backgroundColor:'#121923',borderWidth:1,borderColor:'#273444',borderRadius:14,color:'#FFF',paddingHorizontal:15,paddingVertical:14,fontSize:16},row:{flexDirection:'row',gap:12},rowField:{flex:1},choiceRow:{flexDirection:'row',gap:10,marginBottom:18},choiceGrid:{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:18},choice:{backgroundColor:'#121923',borderWidth:1,borderColor:'#273444',borderRadius:12,paddingVertical:12,paddingHorizontal:15},choiceActive:{borderColor:'#7EE787',backgroundColor:'#13241A'},choiceText:{color:'#AEB8C5',fontWeight:'700'},choiceTextActive:{color:'#7EE787'},primaryButton:{backgroundColor:'#7EE787',paddingVertical:17,borderRadius:15,alignItems:'center',marginTop:10},disabled:{opacity:.35},primaryText:{color:'#071009',fontSize:16,fontWeight:'900'},disclaimer:{color:'#667386',fontSize:11,lineHeight:17,textAlign:'center',marginTop:16}
});
