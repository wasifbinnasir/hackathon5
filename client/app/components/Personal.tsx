'use client'
import { useGetMeQuery, useUpdatePersonalMutation, useUpdateAddressMutation, useUpdateTrafficMutation } from '@/lib/apis'
import { useState, useEffect } from 'react'

export default function Personal() {
  const { data: me } = useGetMeQuery()
  const [updatePersonal] = useUpdatePersonalMutation()
  const [updateAddress] = useUpdateAddressMutation()
  const [updateTraffic] = useUpdateTrafficMutation()

  const [personal, setPersonal] = useState<any>({})
  const [address, setAddress] = useState<any>({})
  const [traffic, setTraffic] = useState<any>({})

  useEffect(() => {
    if (me) {
      setPersonal({
        name: me.name || '', email: me.email || '', mobileNumber: me.mobileNumber || '',
        nationality: me.nationality || '', idType: me.idType || '', idNumber: me.idNumber || '',
      })
      setAddress({
        country: me.country || '', state: me.state || '', city: me.city || '',
        address1: me.address1 || '', address2: me.address2 || '', landLineNumber: me.landLineNumber || '', poBox: me.poBox || '', zipCode: me.zipCode || '',
      })
      setTraffic({
        trafficInformationType: me.trafficInformationType || '', trafficFileNumber: me.trafficFileNumber || '',
        plateNumber: me.plateNumber || '', plateState: me.plateState || '', driverLicenseNumber: me.driverLicenseNumber || '', issueCity: me.issueCity || '',
      })
    }
  }, [me])

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Personal */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Personal Information</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <input className="border rounded px-3 py-2" placeholder="Full Name" value={personal.name||''} onChange={(e)=>setPersonal({...personal, name:e.target.value})}/>
            <input className="border rounded px-3 py-2" placeholder="Email" value={personal.email||''} onChange={(e)=>setPersonal({...personal, email:e.target.value})}/>
            <input className="border rounded px-3 py-2" placeholder="Mobile Number" value={personal.mobileNumber||''} onChange={(e)=>setPersonal({...personal, mobileNumber:e.target.value})}/>
            <input className="border rounded px-3 py-2" placeholder="Nationality" value={personal.nationality||''} onChange={(e)=>setPersonal({...personal, nationality:e.target.value})}/>
            <input className="border rounded px-3 py-2" placeholder="ID Type" value={personal.idType||''} onChange={(e)=>setPersonal({...personal, idType:e.target.value})}/>
            <input className="border rounded px-3 py-2" placeholder="ID Number" value={personal.idNumber||''} onChange={(e)=>setPersonal({...personal, idNumber:e.target.value})}/>
          </div>
          <button onClick={()=>updatePersonal(personal)} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">Save Personal</button>
        </div>

        {/* Address */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Address</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <input className="border rounded px-3 py-2" placeholder="Country" value={address.country||''} onChange={(e)=>setAddress({...address, country:e.target.value})}/>
            <input className="border rounded px-3 py-2" placeholder="State" value={address.state||''} onChange={(e)=>setAddress({...address, state:e.target.value})}/>
            <input className="border rounded px-3 py-2" placeholder="City" value={address.city||''} onChange={(e)=>setAddress({...address, city:e.target.value})}/>
            <input className="border rounded px-3 py-2" placeholder="Address 1" value={address.address1||''} onChange={(e)=>setAddress({...address, address1:e.target.value})}/>
            <input className="border rounded px-3 py-2" placeholder="Address 2" value={address.address2||''} onChange={(e)=>setAddress({...address, address2:e.target.value})}/>
            <input className="border rounded px-3 py-2" placeholder="Land Line Number" value={address.landLineNumber||''} onChange={(e)=>setAddress({...address, landLineNumber:e.target.value})}/>
            <input className="border rounded px-3 py-2" placeholder="PO Box" value={address.poBox||''} onChange={(e)=>setAddress({...address, poBox:e.target.value})}/>
            <input className="border rounded px-3 py-2" placeholder="Zip Code" value={address.zipCode||''} onChange={(e)=>setAddress({...address, zipCode:e.target.value})}/>
          </div>
          <button onClick={()=>updateAddress(address)} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">Save Address</button>
        </div>

        {/* Traffic */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Traffic File Information</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <input className="border rounded px-3 py-2" placeholder="Traffic Information Type" value={traffic.trafficInformationType||''} onChange={(e)=>setTraffic({...traffic, trafficInformationType:e.target.value})}/>
            <input className="border rounded px-3 py-2" placeholder="Traffic File Number" value={traffic.trafficFileNumber||''} onChange={(e)=>setTraffic({...traffic, trafficFileNumber:e.target.value})}/>
            <input className="border rounded px-3 py-2" placeholder="Plate Number" value={traffic.plateNumber||''} onChange={(e)=>setTraffic({...traffic, plateNumber:e.target.value})}/>
            <input className="border rounded px-3 py-2" placeholder="Plate State" value={traffic.plateState||''} onChange={(e)=>setTraffic({...traffic, plateState:e.target.value})}/>
            <input className="border rounded px-3 py-2" placeholder="Driver License Number" value={traffic.driverLicenseNumber||''} onChange={(e)=>setTraffic({...traffic, driverLicenseNumber:e.target.value})}/>
            <input className="border rounded px-3 py-2" placeholder="Issue City" value={traffic.issueCity||''} onChange={(e)=>setTraffic({...traffic, issueCity:e.target.value})}/>
          </div>
          <button onClick={()=>updateTraffic(traffic)} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">Save Traffic</button>
        </div>
      </div>
    </div>
  )
}
